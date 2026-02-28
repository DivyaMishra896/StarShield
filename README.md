<div align="center">

# 🛡 StarShield AI

### Coordinated Micro-Swarm Detection Engine

**AI-powered threat intelligence platform that detects low-volume, distributed, star-topology coordinated bot networks that evade traditional spike-based detection systems.**

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

</div>

---

## 📋 Overview

StarShield identifies coordinated influence operations across social platforms by fusing multiple AI detection layers into a single risk score. Unlike traditional systems that rely on volume spikes, StarShield detects **micro-swarms** — small, coordinated bot clusters that operate below conventional thresholds.

### Detection Layers

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Semantic Analysis** | Sentence-BERT + FAISS | Detects near-identical content posted within tight time windows |
| **Behavioral Analysis** | Isolation Forest | Flags anomalous posting intervals, timing patterns, and activity rhythms |
| **Graph Topology** | NetworkX + Louvain | Identifies star-formation clusters where one hub coordinates many leaf nodes |
| **Risk Fusion** | Weighted scoring model | Combines all layers into a single explainable threat score |
| **Event Safety** | Burst detection | Reduces false positives during legitimate real-world events |

---

## 🏗 Architecture

```
┌─────────────────────┐        ┌─────────────────────────────────┐
│   Frontend (Vercel)  │        │      Backend (Render)           │
│                      │  POST  │                                 │
│  Next.js 16 + D3.js ├───────►│  FastAPI                        │
│  Tailwind CSS        │  /api/ │  ├── Semantic Engine (BERT)     │
│  Recharts            │ proxy  │  ├── Behavioral Engine (IF)     │
│                      │◄───────┤  ├── Graph Engine (NetworkX)    │
│  - Swarm Graph       │  JSON  │  ├── Fusion Scoring             │
│  - Behavioral Radar  │        │  └── Event Safety Checker       │
│  - Risk Heatmap      │        │                                 │
│  - Propagation Chart │        │  Dataset: Synthetic CSV         │
│  - Geo Clustering    │        │  (600 users, 3000 posts,        │
│  - Alert Queue Table │        │   4 injected micro-swarms)      │
└─────────────────────┘        └─────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, D3.js, Recharts |
| **Backend** | FastAPI, Uvicorn, Python 3.11 |
| **AI/ML** | Sentence-BERT (`all-MiniLM-L6-v2`), FAISS, Isolation Forest, Scikit-learn |
| **Graph Analysis** | NetworkX, python-louvain (Louvain community detection) |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
StarShield/
├── backend/
│   ├── main.py                  # FastAPI app with CORS & error handling
│   ├── schemas.py               # Pydantic response models
│   ├── requirements.txt         # Python dependencies
│   └── services/
│       └── detection_service.py # Orchestrates the full detection pipeline
├── detection_engine/
│   ├── semantic_engine.py       # BERT embeddings + FAISS similarity search
│   ├── behavioral_engine.py     # Isolation Forest anomaly detection
│   ├── graph_engine.py          # Star-topology & community detection
│   ├── fusion.py                # Multi-layer risk fusion scoring
│   ├── event_safety.py          # Real-world event false positive filter
│   └── run_pipeline.py          # Standalone CLI pipeline runner
├── dataset_generator/
│   ├── generate_dataset.py      # Synthetic dataset with injected swarms
│   ├── users.csv                # 600 users (organic + bot clusters)
│   └── posts.csv                # 3000 posts with timestamps & content
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Landing page (mode selection)
│   │   ├── user/page.tsx        # User dashboard (simplified alerts)
│   │   ├── enterprise/page.tsx  # Enterprise console (full tactical view)
│   │   ├── api/run-detection/   # API proxy route to backend
│   │   └── components/          # SwarmGraph, BehavioralRadar, RiskHeatmap, etc.
│   ├── lib/api.ts               # Frontend API client
│   └── next.config.ts           # Vercel build configuration
├── render.yaml                  # Render deployment configuration
└── README.md
```

---

## 🚀 Deployment

### Backend (Render)

| Setting | Value |
|---------|-------|
| **Root Directory** | *(leave blank — repo root)* |
| **Build Command** | `pip install -r backend/requirements.txt` |
| **Start Command** | `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Health Check** | `/health` |

### Frontend (Vercel)

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | Next.js (auto-detected) |
| **Environment Variable** | `BACKEND_URL` = `https://your-app.onrender.com` |

> **Note:** Render free tier has cold starts (~30-50s). The frontend proxy includes a 55-second timeout to handle this gracefully.

---

## 💻 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:
```env
BACKEND_URL=http://localhost:8000
```

---

## 🖥 Dashboards

### User Dashboard
Streamlined threat alert interface for moderators. Quick scan, clear risk levels, and immediate action queue.

### Enterprise Console
Full SOC-grade tactical view with 5 interactive visualizations:
1. **Swarm Topology** — D3.js force-directed graph of detected bot clusters
2. **Attack Wave Heatmap** — Temporal risk distribution across time windows
3. **Influence Velocity** — Propagation speed chart of coordinated content
4. **Suspect Fingerprint** — Radar chart of behavioral anomaly profile
5. **Regional Clustering** — Geographic coordination breakdown

Both dashboards include **Explainable AI** — click any flagged user to see the specific signals (semantic, behavioral, graph centrality, event safety) that contributed to their risk score.

---

## 🔬 How It Works

1. **Data Ingestion** — Load synthetic dataset (600 users, 3000 posts, 4 injected micro-swarms)
2. **Semantic Layer** — Encode all post content with Sentence-BERT, build FAISS index, find near-duplicate pairs within 30-minute windows
3. **Behavioral Layer** — Extract posting interval features per user, run Isolation Forest to flag anomalous timing patterns
4. **Graph Layer** — Build co-posting graph from semantic edges, detect star-topology hubs via degree centrality + clustering coefficient analysis
5. **Fusion** — Combine graph scores (60%) and behavioral scores (40%) into a single risk score
6. **Event Safety** — If activity resembles a real-world event (wide time spread, low centralization), risk scores are dampened by 60% to reduce false positives
7. **Response** — Return top 10 suspicious users with explainable reasons, graph data for D3.js visualization, and aggregate statistics

---

## 👥 Team

Built by a team of 3 in 10 days.

---

## 📄 License

MIT
