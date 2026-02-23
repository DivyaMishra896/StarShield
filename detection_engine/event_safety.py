import numpy as np
import networkx as nx

class EventBurstSafetyChecker:
    """
    Reduces false positives during real-world events
    """

    def __init__(self,
                 min_users=15,
                 max_centrality=0.15,
                 min_time_spread_minutes=90):
        self.min_users = min_users
        self.max_centrality = max_centrality
        self.min_time_spread_minutes = min_time_spread_minutes

    def is_real_event(self, posts_df, graph):
        """
        Returns True if pattern looks like a real-world event
        """

        # 1️⃣ Enough distinct users?
        users = posts_df["user_id"].unique()
        if len(users) < self.min_users:
            return False

        # 2️⃣ Timing spread check
        timestamps = posts_df["timestamp"].sort_values()
        time_spread_minutes = (
            (timestamps.iloc[-1] - timestamps.iloc[0]).total_seconds() / 60
        )

        if time_spread_minutes < self.min_time_spread_minutes:
            return False

        # 3️⃣ Centralization check
        if graph.number_of_nodes() == 0:
            return True

        degree_centrality = nx.degree_centrality(graph)
        max_degree = max(degree_centrality.values())

        if max_degree > self.max_centrality:
            return False  # too centralized → bot-like

        return True