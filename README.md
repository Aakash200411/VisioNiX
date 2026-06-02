
# VisioNiX : Image recognition conversational chatbot

VisioNiX is a **multimodal AI assistant** that combines **Computer Vision, OCR, and Large Language Models (LLMs)** to understand images and generate **context-aware conversational responses**.  

It bridges the gap between traditional vision systems and intelligent reasoning by enabling **visual question answering, scene understanding, and text extraction from images**.

Easy UI based **finetuning** of the pipeline for specific use case along with **autodeployment** on Hugging Face cloud.



## Features
- 🖼️ **Image Understanding**
  - Object Detection (YOLOv8)
  - Image Captioning
  - Scene Analysis

- 🔍 **OCR (Optical Character Recognition)**
  - Extracts printed & handwritten text
  - Supports multilingual text

- 🧠 **Multimodal Reasoning**
  - Combines image + text + objects
  - Uses Vision-Language Models (LLaVA / BLIP-2)

- 💬 **Conversational AI**
  - Chat-based interaction
  - Context-aware responses grounded in visual input

- ⚙️ **Modular Architecture**
  - Easy fine-tuning for domain-specific applications
  - Auto deployment on Hugging Face cloud


## Run Locally

Make sure Ollama is installed

Clone the project

```bash
  git clone https://github.com/AryanKKate/VisioNiX.git
```

Start Frontend

```bash
  npm install
  npm run dev
```

Start Ollama

```bash
  ollama serve
```

Start Backend

```bash
  pip install -r requirements.txt
  python -m venv venv
  venv/Scripts/Activate
  python server.py
```

## Publication
- [VDI-Z](https://vzipjournal.com/volume-13-issue-4-2026/)
## Authors

- [@Aryan Kate](https://github.com/AryanKKate)
- [@Aakash Lodha](https://github.com/Aakash200411)
- [@Bhuvan Patil](https://github.com/bhu1421)
- [@Siddhesh Patil](https://github.com/siddhesh455patil)

