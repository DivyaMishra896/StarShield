import networkx as nx
import community as community_louvain

class GraphEngine:

    def build_graph(self, semantic_edges):
        G = nx.Graph()

        for u1, u2, weight in semantic_edges:
            G.add_edge(u1, u2, weight=weight)

        return G

    def compute_metrics(self, G):
        degree = nx.degree_centrality(G)
        betweenness = nx.betweenness_centrality(G)
        clustering = nx.clustering(G)

        partition = community_louvain.best_partition(G)

        return degree, betweenness, clustering, partition
    
    def detect_star_nodes(self, G, degree, clustering):
        star_scores = {}

        for node in G.nodes():
            deg = degree.get(node, 0)
            cluster_coeff = clustering.get(node, 0)
            neighbors = list(G.neighbors(node))

            if len(neighbors) == 0:
                star_scores[node] = 0
                continue

            avg_neighbor_degree = sum(dict(G.degree(neighbors)).values()) / len(neighbors)

            # Star condition
            score = (
                deg * 0.5 +
                (1 - cluster_coeff) * 0.3 +
                (1 / (avg_neighbor_degree + 1)) * 0.2
            )

            star_scores[node] = min(score, 1)

        return star_scores