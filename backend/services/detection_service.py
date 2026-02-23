import pandas as pd

from detection_engine.semantic_engine import SemanticEngine
from detection_engine.behavioral_engine import BehavioralEngine
from detection_engine.graph_engine import GraphEngine
from detection_engine.fusion import fuse_risk
from detection_engine.event_safety import EventBurstSafetyChecker


def run_detection():
    # Load data
    users_df = pd.read_csv("dataset_generator/users.csv")
    posts_df = pd.read_csv("dataset_generator/posts.csv")
    posts_df["timestamp"] = pd.to_datetime(posts_df["timestamp"])

    # Semantic
    semantic = SemanticEngine()
    embeddings = semantic.build_embeddings(posts_df)
    index = semantic.build_faiss_index(embeddings)
    semantic_edges = semantic.find_similar_pairs(
        embeddings, index, posts_df
    )

    # Behavioral
    behavior = BehavioralEngine()
    features = behavior.extract_features(posts_df)
    behavior_scores = behavior.compute_anomaly_scores(features)

    # Graph
    graph_engine = GraphEngine()
    G = graph_engine.build_graph(semantic_edges)
    degree, _, clustering, _ = graph_engine.compute_metrics(G)
    graph_scores = graph_engine.detect_star_nodes(G, degree, clustering)

    # Fusion
    final_scores = fuse_risk(graph_scores, behavior_scores)

    # Event safety
    event_checker = EventBurstSafetyChecker()
    if event_checker.is_real_event(posts_df, G):
        for u in final_scores:
            final_scores[u] *= 0.4

    # Top suspicious users
    top_users = sorted(
        final_scores.items(), key=lambda x: x[1], reverse=True
    )[:10]

    return {
        "top_suspicious_users": [
            {"user_id": u, "risk_score": round(s, 3)}
            for u, s in top_users
        ]
    }