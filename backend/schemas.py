from pydantic import BaseModel
from typing import List


class RiskReasons(BaseModel):
    semantic: str
    behavioral: str
    graph_centrality: str
    event_safety: str


class SuspiciousUser(BaseModel):
    user_id: str
    risk_score: float
    reasons: RiskReasons


class GraphNode(BaseModel):
    id: str
    group: int
    influence: float


class GraphLink(BaseModel):
    source: str
    target: str


class GraphData(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]


class DetectionStats(BaseModel):
    total_users: int
    semantic_edges: int
    suspicious_clusters: int


class DetectionResponse(BaseModel):
    top_suspicious_users: List[SuspiciousUser]
    stats: DetectionStats
    insight: str
    graph_data: GraphData