from pydantic import BaseModel
from typing import Dict, Any

class UserSchema(BaseModel):
    uid: str
    request_headers: str
    browser_json: Dict[str, Any] 