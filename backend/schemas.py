from pydantic import BaseModel
from typing import List

class SuspiciousUser(BaseModel):
    user_id: str
    risk_score: float

class DetectionResponse(BaseModel):
    top_suspicious_users: List[SuspiciousUser]