import json
import os
import re
import shutil
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any
from urllib.parse import urlparse

from huggingface_hub import HfApi


def _slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9-]+", "-", value.strip().lower())
    cleaned = re.sub(r"-+", "-", cleaned).strip("-")
    return cleaned or "model"


def _get_token() -> str:
    token = (os.getenv("HF_TOKEN") or "").strip()
    if not token:
        raise ValueError("HF_TOKEN is required for Hugging Face deployment")
    return token


def _append_unique_suffix(base_slug: str, unique_suffix: str | None = None) -> str:
    suffix = _slugify(unique_suffix or "")
    if not suffix:
        return base_slug
    return f"{base_slug}-{suffix}"


def _resolve_model_repo_id(
    model_name: str,
    requested_repo: str | None = None,
    unique_suffix: str | None = None,
) -> str:
    if requested_repo:
        slug = requested_repo.strip()
        if "/" in slug:
            return slug
        owner = (os.getenv("HF_MODEL_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
        if owner:
            return f"{owner}/{slug}"
        return slug

    owner = (os.getenv("HF_MODEL_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
    if not owner:
        raise ValueError("HF_MODEL_OWNER or HF_USERNAME_OR_ORG env var is required when hf_model_repo is not provided")
    default_slug = _append_unique_suffix(_slugify(model_name), unique_suffix=unique_suffix)
    return f"{owner}/{default_slug}"


def _resolve_space_slug(
    model_name: str,
    requested_slug: str | None = None,
    unique_suffix: str | None = None,
) -> str:
    if requested_slug:
        slug = requested_slug.strip()
        if "/" in slug:
            return slug
        owner = (os.getenv("HF_SPACE_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
        if owner:
            return f"{owner}/{slug}"
        return slug

    owner = (os.getenv("HF_SPACE_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
    if not owner:
        raise ValueError("HF_SPACE_OWNER or HF_USERNAME_OR_ORG env var is required when hf_space_slug is not provided")
    default_slug = _append_unique_suffix(_slugify(model_name), unique_suffix=unique_suffix)
    return f"{owner}/{default_slug}"


def _space_app_template(model_name: str, task_type: str) -> str:
    safe_name = model_name.replace("\"", "'")
    safe_task = task_type.replace("\"", "'")
    return f'''import os\nimport tempfile\nfrom pathlib import Path\n\nos.environ.setdefault("YOLO_CONFIG_DIR", "/tmp/Ultralytics")\n\nimport gradio as gr\nfrom ultralytics import YOLO\n\nMODEL_PATH = Path(__file__).parent / "model.pt"\nmodel = YOLO(str(MODEL_PATH))\nCLASS_NAMES = model.names if isinstance(model.names, dict) else {{idx: name for idx, name in enumerate(model.names)}}\n\n\ndef predict(image):\n    if image is None:\n        return {{"error": "No image provided", "detections": [], "predictions": []}}\n\n    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:\n        image.save(tmp.name)\n        temp_path = tmp.name\n\n    try:\n        results = model(temp_path)\n        first = results[0]\n        detections = []\n        predictions = []\n\n        boxes = getattr(first, "boxes", None)\n        if boxes is not None:\n            for box in boxes:\n                class_id = int(box.cls.item())\n                detections.append({{\n                    "class_id": class_id,\n                    "label": str(CLASS_NAMES.get(class_id, class_id)),\n                    "confidence": float(box.conf.item()),\n                    "xyxy": [float(x) for x in box.xyxy[0].tolist()],\n                }})\n\n        probs = getattr(first, "probs", None)\n        top5 = getattr(probs, "top5", None) if probs is not None else None\n        top5conf = getattr(probs, "top5conf", None) if probs is not None else None\n        if top5 is not None and top5conf is not None:\n            confidences = top5conf.tolist() if hasattr(top5conf, "tolist") else list(top5conf)\n            for class_id, confidence in zip(top5, confidences):\n                predictions.append({{\n                    "class_id": int(class_id),\n                    "label": str(CLASS_NAMES.get(int(class_id), class_id)),\n                    "confidence": float(confidence),\n                }})\n\n        return {{\n            "model": "{safe_name}",\n            "task": "{safe_task}",\n            "detections": detections,\n            "predictions": predictions,\n        }}\n    finally:\n        Path(temp_path).unlink(missing_ok=True)\n\n\ndemo = gr.Interface(\n    fn=predict,\n    inputs=gr.Image(type="pil", label="Upload image"),\n    outputs=gr.JSON(label="output"),\n    title="{safe_name}",\n    description="Automated deployment from VisioNiX",\n)\n\nif __name__ == "__main__":\n    demo.launch()\n'''


def _build_model_card(model_name: str, task_type: str, metrics: dict[str, Any] | None = None) -> str:
    content = [
        f"# {model_name}",
        "",
        "Auto-uploaded from the VisioNiX fine-tuning pipeline.",
        "",
        f"- Task: {task_type}",
        "- Artifact: `best.pt`",
    ]

    if metrics:
        content.extend(
            [
                "",
                "## Metrics",
                "",
                "```json",
                json.dumps(metrics, indent=2, sort_keys=True),
                "```",
            ]
        )

    return "\n".join(content) + "\n"


def _build_space_readme(model_name: str, hf_model_url: str | None = None) -> str:
    safe_name = model_name.replace('"', "'")
    model_reference = f"\nModel repo: {hf_model_url}\n" if hf_model_url else "\n"
    return (
        "---\n"
        f"title: {safe_name}\n"
        "emoji: 🚀\n"
        "colorFrom: blue\n"
        "colorTo: indigo\n"
        "sdk: gradio\n"
        "python_version: '3.10'\n"
        "app_file: app.py\n"
        "pinned: false\n"
        "---\n\n"
        f"# {safe_name}\n\n"
        f"Auto-deployed from VisioNiX training pipeline.{model_reference}"
    )


def upload_model_to_hf_hub(
    model_artifact_path: str,
    model_name: str,
    task_type: str,
    hf_model_repo: str | None = None,
    unique_suffix: str | None = None,
    metrics: dict[str, Any] | None = None,
) -> dict[str, str]:
    token = _get_token()

    artifact = Path(model_artifact_path).resolve()
    if not artifact.exists() or not artifact.is_file():
        raise FileNotFoundError(f"Model artifact not found: {artifact}")

    repo_id = _resolve_model_repo_id(
        model_name=model_name,
        requested_repo=hf_model_repo,
        unique_suffix=unique_suffix,
    )

    api = HfApi(token=token)
    api.create_repo(repo_id=repo_id, repo_type="model", exist_ok=True)

    with TemporaryDirectory(prefix="visionix_model_") as temp_dir:
        bundle_dir = Path(temp_dir)
        shutil.copy2(artifact, bundle_dir / "best.pt")

        results_csv = artifact.parents[1] / "results.csv"
        if results_csv.exists():
            shutil.copy2(results_csv, bundle_dir / "results.csv")

        args_yaml = artifact.parents[1] / "args.yaml"
        if args_yaml.exists():
            shutil.copy2(args_yaml, bundle_dir / "args.yaml")

        if metrics:
            (bundle_dir / "metrics.json").write_text(
                json.dumps(metrics, indent=2, sort_keys=True),
                encoding="utf-8",
            )

        (bundle_dir / "README.md").write_text(
            _build_model_card(model_name=model_name, task_type=task_type, metrics=metrics),
            encoding="utf-8",
        )

        api.upload_folder(
            repo_id=repo_id,
            repo_type="model",
            folder_path=str(bundle_dir),
            commit_message=f"Upload fine-tuned model {model_name} from VisioNiX",
        )

    return {
        "repo_id": repo_id,
        "model_url": f"https://huggingface.co/{repo_id}",
    }


def deploy_to_hf_space(
    model_artifact_path: str,
    model_name: str,
    task_type: str,
    hf_space_slug: str | None = None,
    hf_model_url: str | None = None,
    unique_suffix: str | None = None,
) -> dict:
    token = _get_token()

    artifact = Path(model_artifact_path).resolve()
    if not artifact.exists() or not artifact.is_file():
        raise FileNotFoundError(f"Model artifact not found: {artifact}")

    repo_id = _resolve_space_slug(
        model_name=model_name,
        requested_slug=hf_space_slug,
        unique_suffix=unique_suffix,
    )

    api = HfApi(token=token)
    api.create_repo(repo_id=repo_id, repo_type="space", space_sdk="gradio", exist_ok=True)

    with TemporaryDirectory(prefix="visionix_space_") as temp_dir:
        bundle_dir = Path(temp_dir)

        shutil.copy2(artifact, bundle_dir / "model.pt")
        (bundle_dir / "app.py").write_text(_space_app_template(model_name, task_type), encoding="utf-8")
        (bundle_dir / "requirements.txt").write_text("gradio\nultralytics\npillow\n", encoding="utf-8")
        (bundle_dir / "README.md").write_text(
            _build_space_readme(model_name=model_name, hf_model_url=hf_model_url),
            encoding="utf-8",
        )

        api.upload_folder(
            repo_id=repo_id,
            repo_type="space",
            folder_path=str(bundle_dir),
            commit_message=f"Deploy model {model_name} from VisioNiX",
        )

    return {
        "repo_id": repo_id,
        "space_url": f"https://huggingface.co/spaces/{repo_id}",
        "hf_space_url": f"https://{repo_id.replace('/', '-')}.hf.space",
    }


def _extract_model_repo_id(
    hf_model_repo_id: str | None = None,
    hf_model_url: str | None = None,
    requested_repo: str | None = None,
) -> str | None:
    explicit_repo_id = (hf_model_repo_id or "").strip()
    if explicit_repo_id and "/" in explicit_repo_id:
        return explicit_repo_id

    requested_value = (requested_repo or "").strip()
    if requested_value:
        if "/" in requested_value:
            return requested_value
        owner = (os.getenv("HF_MODEL_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
        if owner:
            return f"{owner}/{requested_value}"

    url = (hf_model_url or "").strip()
    if not url:
        return None

    parsed = urlparse(url)
    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) >= 2 and parts[0] != "spaces":
        return f"{parts[0]}/{parts[1]}"
    return None


def _extract_space_repo_id(
    hf_space_url: str | None = None,
    hf_space_slug: str | None = None,
) -> str | None:
    slug = (hf_space_slug or "").strip()
    if slug:
        if "/" in slug:
            return slug
        owner = (os.getenv("HF_SPACE_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
        if owner:
            return f"{owner}/{slug}"

    url = (hf_space_url or "").strip()
    if not url:
        return None

    parsed = urlparse(url)
    parts = [part for part in parsed.path.split("/") if part]
    if len(parts) >= 3 and parts[0] == "spaces":
        return f"{parts[1]}/{parts[2]}"

    host = (parsed.netloc or "").split(":", 1)[0]
    if host.endswith(".hf.space"):
        host_prefix = host[: -len(".hf.space")]
        owner = (os.getenv("HF_SPACE_OWNER") or os.getenv("HF_USERNAME_OR_ORG") or "").strip()
        owner_slug = _slugify(owner)
        if owner and owner_slug and host_prefix.lower().startswith(f"{owner_slug}-"):
            return f"{owner}/{host_prefix[len(owner_slug) + 1:]}"
    return None


def delete_hf_assets(
    *,
    hf_model_repo_id: str | None = None,
    hf_model_url: str | None = None,
    hf_model_repo: str | None = None,
    hf_space_url: str | None = None,
    hf_space_slug: str | None = None,
) -> dict[str, Any]:
    token = _get_token()
    api = HfApi(token=token)

    deleted: dict[str, str | None] = {"model_repo_id": None, "space_repo_id": None}
    warnings: list[str] = []

    model_repo_id = _extract_model_repo_id(
        hf_model_repo_id=hf_model_repo_id,
        hf_model_url=hf_model_url,
        requested_repo=hf_model_repo,
    )
    if model_repo_id:
        try:
            api.delete_repo(repo_id=model_repo_id, repo_type="model")
            deleted["model_repo_id"] = model_repo_id
        except Exception as exc:
            warnings.append(f"Failed to delete HF model repo {model_repo_id}: {exc}")

    space_repo_id = _extract_space_repo_id(
        hf_space_url=hf_space_url,
        hf_space_slug=hf_space_slug,
    )
    if space_repo_id:
        try:
            api.delete_repo(repo_id=space_repo_id, repo_type="space")
            deleted["space_repo_id"] = space_repo_id
        except Exception as exc:
            warnings.append(f"Failed to delete HF Space {space_repo_id}: {exc}")

    return {"deleted": deleted, "warnings": warnings}
