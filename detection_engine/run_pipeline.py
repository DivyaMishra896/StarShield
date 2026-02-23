import pandas as pd

from semantic_engine import SemanticEngine
from behavioral_engine import BehavioralEngine
from graph_engine import GraphEngine
from fusion import fuse_risk
from event_safety import EventBurstSafetyChecker

# 1️⃣ Load data
users_df = pd.read_csv("../dataset_generator/users.csv")
posts_df = pd.read_csv("../dataset_generator/posts.csv")

# Convert timestamp
posts_df["timestamp"] = pd.to_datetime(posts_df["timestamp"])

print("Data loaded")

# 2️⃣ Semantic Engine
semantic = SemanticEngine(similarity_threshold=0.85)

embeddings = semantic.build_embeddings(posts_df)
index = semantic.build_faiss_index(embeddings)
semantic_edges = semantic.find_similar_pairs(
    embeddings, index, posts_df, time_window_minutes=30
)

print(f"Semantic edges created: {len(semantic_edges)}")

# 3️⃣ Behavioral Engine
behavior = BehavioralEngine()
features = behavior.extract_features(posts_df)
behavior_scores = behavior.compute_anomaly_scores(features)

print("Behavioral scores computed")

# 4️⃣ Graph Engine
graph_engine = GraphEngine()
G = graph_engine.build_graph(semantic_edges)

degree, betweenness, clustering, communities = graph_engine.compute_metrics(G)
graph_scores = graph_engine.detect_star_nodes(G, degree, clustering)

# 🛡 Event Burst Safety Check
event_checker = EventBurstSafetyChecker()
is_real_event = event_checker.is_real_event(posts_df, G)

print("Graph analysis completed")

# 5️⃣ Fusion
final_scores = fuse_risk(graph_scores, behavior_scores)

# 🛡 Downgrade risk during real-world events
if is_real_event:
    print("⚠️ Real-world event pattern detected — applying safety downgrade")
    for user in final_scores:
        final_scores[user] *= 0.4
        
# 6️⃣ Show Top Suspicious Users
top_suspicious = sorted(
    final_scores.items(), key=lambda x: x[1], reverse=True
)[:10]

print("\n🔥 TOP SUSPICIOUS USERS 🔥")
for user, score in top_suspicious:
    print(user, round(score, 3))