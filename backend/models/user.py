from pydantic import BaseModel

class UserSchema(BaseModel):
    uid: str
    request_headers: str
    browser_json: str