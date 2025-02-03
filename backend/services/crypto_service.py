from Crypto.Cipher import AES
from typing import Any
import base64
import json
import os

SECRET_KEY = os.getenv("ENCRYPTION_KEY")

if SECRET_KEY is None or len(SECRET_KEY) < 32:
    raise ValueError("SECRET_KEY must be at least 32 characters long.")

SECRET_KEY = SECRET_KEY[:32]

def encrypt_data(data: Any) -> str:
    """Encrypts JSON data or a string and returns a base64 encoded string."""
    json_data = json.dumps(data) 
    cipher = AES.new(SECRET_KEY.encode(), AES.MODE_EAX)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(json_data.encode())
    return base64.b64encode(nonce + ciphertext).decode()

def decrypt_data(encrypted_data: str) -> Any:
    """Decrypts base64 encoded string and converts it back to JSON if needed."""
    raw_data = base64.b64decode(encrypted_data)
    nonce = raw_data[:16]
    ciphertext = raw_data[16:]
    cipher = AES.new(SECRET_KEY.encode(), AES.MODE_EAX, nonce=nonce)
    decrypted_text = cipher.decrypt(ciphertext).decode()

    try:
        return json.loads(decrypted_text)  # convert back to JSON
    except json.JSONDecodeError:
        return decrypted_text  # if it's a string, return as is
