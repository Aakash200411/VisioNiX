from typing import Any, Optional

from flask import Blueprint, jsonify, request
from supabase import AuthApiError

from app.services.supabase_client import get_supabase_client
from app.services.training_jobs import (
    create_training_job,
    find_matching_active_training_job,
    get_training_job,
    list_training_jobs,
    normalize_training_payload,
)
from app.services.training_runner import (
    delete_training_job_resources,
    deploy_training_job,
    enqueue_training_job,
    ensure_training_job_model_registration,
    recover_training_job_state,
)


training_bp = Blueprint("training", __name__, url_prefix="/training")


def _extract_bearer_token(auth_header: str) -> Optional[str]:
    if not auth_header:
        return None

    parts = auth_header.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None

    return parts[1]


def _get_user_from_request() -> tuple[Any | None, tuple[Any, int] | None]:
    token = _extract_bearer_token(request.headers.get("Authorization", ""))
    if not token:
        return None, (jsonify({"error": "Bearer token is required"}), 401)

    if not isinstance(token, str) or token.count(".") != 2:
        return None, (jsonify({"error": "Malformed access token"}), 401)

    try:
        supabase = get_supabase_client()
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            return None, (jsonify({"error": "Invalid user session"}), 401)
        return user_response.user, None
    except (AuthApiError, ValueError) as exc:
        return None, (jsonify({"error": str(exc)}), 401)
    except Exception as exc:
        return None, (jsonify({"error": f"unexpected error: {exc}"}), 500)


@training_bp.route("/jobs", methods=["POST"])
def create_job():
    user, error = _get_user_from_request()
    if error:
        return error

    payload = request.get_json(silent=True) or {}
    normalized_payload, validation_errors = normalize_training_payload(payload)
    if validation_errors:
        return jsonify({"error": "validation_error", "details": validation_errors}), 400

    duplicate_job, storage_backend = find_matching_active_training_job(user.id, normalized_payload)
    if duplicate_job:
        return (
            jsonify(
                {
                    "job": duplicate_job,
                    "storage": storage_backend,
                    "worker_started": False,
                    "duplicate": True,
                    "message": "A matching fine-tuning job is already in progress.",
                }
            ),
            200,
        )

    job, storage_backend = create_training_job(user.id, normalized_payload)
    worker_started = enqueue_training_job(job)

    return jsonify({"job": job, "storage": storage_backend, "worker_started": worker_started}), 201


@training_bp.route("/jobs", methods=["GET"])
def list_jobs():
    user, error = _get_user_from_request()
    if error:
        return error

    jobs, storage_backend = list_training_jobs(user.id)
    synced_jobs = []
    for job in jobs:
        hydrated_job = recover_training_job_state(user.id, str(job.get("id"))) or job
        synced_job = ensure_training_job_model_registration(user.id, str(hydrated_job.get("id"))) or hydrated_job
        synced_jobs.append(synced_job)
    jobs = synced_jobs
    return jsonify({"jobs": jobs, "storage": storage_backend})


@training_bp.route("/jobs/<job_id>", methods=["GET"])
def get_job(job_id: str):
    user, error = _get_user_from_request()
    if error:
        return error

    job, storage_backend = get_training_job(user.id, job_id)
    if not job:
        return jsonify({"error": "job not found", "id": job_id}), 404

    job = recover_training_job_state(user.id, job_id) or job
    job = ensure_training_job_model_registration(user.id, job_id) or job
    return jsonify({"job": job, "storage": storage_backend})


@training_bp.route("/jobs/<job_id>/deploy", methods=["POST"])
def deploy_job(job_id: str):
    user, error = _get_user_from_request()
    if error:
        return error

    try:
        result = deploy_training_job(user_id=user.id, job_id=job_id)
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400


@training_bp.route("/jobs/<job_id>", methods=["DELETE"])
def delete_job(job_id: str):
    user, error = _get_user_from_request()
    if error:
        return error

    payload = request.get_json(silent=True) or {}
    delete_remote = bool(payload.get("delete_remote", False))
    delete_local_artifacts = bool(payload.get("delete_local_artifacts", True))

    try:
        result = delete_training_job_resources(
            user_id=user.id,
            job_id=job_id,
            delete_remote=delete_remote,
            delete_local_artifacts=delete_local_artifacts,
        )
        return jsonify(result)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 400
