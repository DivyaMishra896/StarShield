import numpy as np
from sklearn.ensemble import IsolationForest

class BehavioralEngine:

    def extract_features(self, posts_df):
        features = {}

        grouped = posts_df.groupby("user_id")

        for user_id, group in grouped:
            timestamps = sorted(group["timestamp"])
            intervals = np.diff([t.timestamp() for t in timestamps])

            avg_interval = np.mean(intervals) if len(intervals) > 0 else 0
            var_interval = np.var(intervals) if len(intervals) > 0 else 0
            active_hour = np.mean([t.hour for t in timestamps])

            features[user_id] = [avg_interval, var_interval, active_hour]

        return features

    def compute_anomaly_scores(self, feature_dict):
        user_ids = list(feature_dict.keys())
        X = np.array(list(feature_dict.values()))

        model = IsolationForest(contamination=0.08, random_state=42)
        model.fit(X)

        scores = model.decision_function(X)
        normalized_scores = (scores - scores.min()) / (scores.max() - scores.min())

        return dict(zip(user_ids, 1 - normalized_scores))  # higher = more suspicious