# Blossom

A clinical radiology platform for managing mammogram cases, running AI-assisted analysis, and supporting radiologist workflows.

---

## What it does

- **Case management** — create and manage patient mammogram cases with clinical metadata (study type, breast density, referring physician, priority)
- **Image upload** — securely upload mammogram images to Supabase Storage
- **AI analysis** — submit images for automated BI-RADS classification via the SensiNet inference service
- **Results display** — view malignancy probability, confidence scores, and findings text per analysis; re-run analysis at any time
- **Radiologist accounts** — authentication, profiles, password reset flow
- **Audit trail** — all analyses are persisted with timestamps and model version

---

## Authorship

Blossom (this application — UI, API routes, database schema, clinical workflow) is an **original work** by the Blossom team.

The AI model powering the mammogram analysis is **not** authored by the Blossom team. See the [mammogram-inference-service README](mammogram-inference-service/README.md) for full attribution.

---

## Tech stack

**Frontend / Backend**
- [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — Auth, PostgreSQL, Storage

**AI inference**
- [mammogram-inference-service](mammogram-inference-service/) — FastAPI microservice
- Model: **SensiNet** (Xception + EfficientNet-B3 dual-stream, CBAM attention)
- Original model by [Aredeksu/SensiNet-Mammography](https://huggingface.co/Aredeksu/SensiNet-Mammography) (Apache-2.0)
- Trained on: CBIS-DDSM mammography dataset

---

## Project structure

```
blossom/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   │   ├── analyze/      # POST /api/analyze — triggers AI inference
│   │   │   ├── cases/        # CRUD for patient cases
│   │   │   └── profile/      # Radiologist profile management
│   │   ├── cases/            # Case list and analysis pages
│   │   ├── dashboard/        # Main dashboard
│   │   ├── forgot-password/  # Password reset request
│   │   └── auth/
│   │       └── reset-password/  # Password reset confirmation
│   └── lib/
│       └── supabase/         # Supabase client (browser, server, admin)
└── mammogram-inference-service/  # Python FastAPI AI backend
```

---

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project
- Python 3.10+ (for the inference service)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Point to the running inference service
GCLOUD_MODEL_ENDPOINT=http://localhost:8000
```

### 3. Run the web app

```bash
npm run dev
```

### 4. Run the AI inference service

See [mammogram-inference-service/README.md](mammogram-inference-service/README.md) for full setup instructions.

```bash
cd mammogram-inference-service
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The inference service runs in **mock mode** if model weights are not present — useful for UI development.

---

## AI model attribution

The mammogram analysis feature is powered by **SensiNet**, a dual-stream deep learning model for mammographic classification.

> **Original model:** [Aredeksu/SensiNet-Mammography](https://huggingface.co/Aredeksu/SensiNet-Mammography) on Hugging Face
> **License:** Apache License 2.0
> **Architecture:** Xception + EfficientNet-B3 with CBAM attention fusion
> **Training data:** CBIS-DDSM (Curated Breast Imaging Subset of DDSM)

The Blossom team did **not** design the SensiNet architecture or produce its weights. Our contribution is the FastAPI wrapper, Bayesian inference pipeline, training script adaptation, and integration with the Blossom clinical workflow. We use the model under its Apache 2.0 license, which requires this attribution.

---

## Important notice

Blossom is a **research and development prototype**. It has not been validated for clinical use. AI-generated BI-RADS scores are estimates only and must not be used to diagnose, treat, or manage patients without appropriate radiologist oversight and regulatory approval.

---

## License

The Blossom application code is original work by the Blossom team. The SensiNet model is used under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) — copyright belongs to its original authors.
