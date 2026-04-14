from functools import wraps
from flask import jsonify, request
from supabase import AuthApiError

from app.services.supabase_client import get_supabase_client


def require_supabase_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401

        token = auth_header.split(" ")[1]

        try:
            supabase = get_supabase_client()
            user_response = supabase.auth.get_user(token)
            user = user_response.user
            if not user:
                return jsonify({"error": "Invalid token"}), 401
        except (AuthApiError, ValueError):
            return jsonify({"error": "Invalid token"}), 401
        except Exception as exc:
            return jsonify({"error": f"Authentication failed: {exc}"}), 500

        request.user = {
            "id": user.id,
            "sub": user.id,
            "email": getattr(user, "email", None),
        }
        return f(*args, **kwargs)

    return wrapper
