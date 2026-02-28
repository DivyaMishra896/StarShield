import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize

class SemanticEngine:

    def __init__(self, similarity_threshold=0.85):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.similarity_threshold = similarity_threshold

    def build_embeddings(self, posts_df):
        texts = posts_df["content"].tolist()
        embeddings = self.model.encode(texts, show_progress_bar=False)
        embeddings = normalize(embeddings)
        return embeddings

    def build_faiss_index(self, embeddings):
        dimension = embeddings.shape[1]
        index = faiss.IndexFlatIP(dimension)  # cosine similarity
        index.add(embeddings)
        return index

    def find_similar_pairs(self, embeddings, index, posts_df, time_window_minutes=30):
        D, I = index.search(embeddings, k=5)

        edges = []
        timestamps = posts_df["timestamp"].tolist()

        for i in range(len(I)):
            for j_idx, score in zip(I[i], D[i]):
                if i == j_idx:
                    continue
                if score > self.similarity_threshold:
                    time_diff = abs((timestamps[i] - timestamps[j_idx]).total_seconds()) / 60
                    if time_diff <= time_window_minutes:
                        edges.append((posts_df.iloc[i]["user_id"],
                                      posts_df.iloc[j_idx]["user_id"],
                                      float(score)))
        return edges