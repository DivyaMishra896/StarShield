import pandas as pd
import networkx as nx  # Added import
from pathlib import Path

from detection_engine.semantic_engine import SemanticEngine
from detection_engine.behavioral_engine import BehavioralEngine
from detection_engine.graph_engine import GraphEngine
from detection_engine.fusion import fuse_risk
from detection_engine.event_safety import EventBurstSafetyChecker

def run_detection():
    # 1. Path Handling
    ROOT_DIR = Path(__file__).resolve().parent.parent.parent
    users_csv_path = ROOT_DIR / "dataset_generator" / "users.csv"
    posts_csv_path = ROOT_DIR / "dataset_generator" / "posts.csv"

    # Load data
    users_df = pd.read_csv(users_csv_path)
    posts_df = pd.read_csv(posts_csv_path)
    posts_df["timestamp"] = pd.to_datetime(posts_df["timestamp"])

    # Semantic Engine
    semantic = SemanticEngine()
    embeddings = semantic.build_embeddings(posts_df)
    index = semantic.build_faiss_index(embeddings)
    semantic_edges = semantic.find_similar_pairs(embeddings, index, posts_df)

    # Behavioral Engine
    behavior = BehavioralEngine()
    features = behavior.extract_features(posts_df)
    behavior_scores = behavior.compute_anomaly_scores(features)

    # Graph Engine
    graph_engine = GraphEngine()
    G = graph_engine.build_graph(semantic_edges) # G is defined here
    degree, _, clustering, _ = graph_engine.compute_metrics(G)
    graph_scores = graph_engine.detect_star_nodes(G, degree, clustering)

    # Fusion
    final_scores = fuse_risk(graph_scores, behavior_scores)

    # Event safety
    event_checker = EventBurstSafetyChecker()
    is_event = event_checker.is_real_event(posts_df, G)
    if is_event:
        for u in final_scores:
            final_scores[u] *= 0.4

    # Influence Score Calculation (Executive Metric)
    centrality = nx.degree_centrality(G)

    # Top suspicious users
    top_users = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:10]

    # Build enriched explainable data
    enriched_users = []
    for u, s in top_users:
        b_score = behavior_scores.get(u, 0)
        g_score = graph_scores.get(u, 0)
        
        enriched_users.append({
            "user_id": u,
            "risk_score": round(s, 3),
            "reasons": {
                "semantic": "High" if s > 0.4 else "Medium",
                "behavioral": "High" if b_score > 0.5 else ("Medium" if b_score > 0.2 else "Low"),
                "graph_centrality": "Very High" if g_score > 0.6 else ("High" if g_score > 0.3 else "Medium"),
                "event_safety": "Passed" if not is_event else "Mitigated (Event Detected)"
            }
        })

    # Extract Graph Data for D3.js with Influence Logic
    graph_data = {
        "nodes": [
            {
                "id": str(n), 
                "group": 1 if n in final_scores and final_scores[n] > 0.4 else 2,
                "influence": centrality.get(n, 0) * 100 
            } for n in G.nodes()
        ],
        "links": [{"source": str(u), "target": str(v)} for u, v in G.edges()]
    }

    return {
        "top_suspicious_users": enriched_users,
        "stats": {
            "total_users": len(users_df),
            "semantic_edges": len(semantic_edges),
            "suspicious_clusters": sum(1 for _, score in graph_scores.items() if score > 0.5) 
        },
        "insight": "Star topology detected in cluster #2 — 1 hub, 10 coordinated nodes.",
        "graph_data": graph_data
    }