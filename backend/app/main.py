import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

from .services.api_response import get_dashboard_response


HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))


class DefectSenseHandler(BaseHTTPRequestHandler):

    def send_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")

        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:5173"))
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, status_code, message):
        self.send_json(
            status_code,
            {
                "status": "error",
                "message": message,
            },
        )

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:5173"))
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlsplit(self.path).path
        self.path = path
        if self.path == "/health":
            self.send_json(
                200,
                {
                    "status": "ok",
                    "service": "DefectSense AI",
                },
            )
            return

        if self.path == "/api/dashboard":
            try:
                response = get_dashboard_response()
                self.send_json(200, response)
            except Exception:
                self.send_json(
                    500,
                    {
                        "status": "error",
                        "message": "Unable to build dashboard response.",
                    },
                )
            return

        if self.path == "/api/claims":
            try:
                response = get_dashboard_response()
                self.send_json(
                    200,
                    {
                        "status": "success",
                        "count": len(response["claims"]),
                        "claims": response["claims"],
                    },
                )
            except Exception:
                self.send_json(
                    500,
                    {
                        "status": "error",
                        "message": "Unable to load claims.",
                    },
                )
            return

        if self.path == "/api/defects":
            try:
                response = get_dashboard_response()
                self.send_json(
                    200,
                    {
                        "status": "success",
                        "count": len(response["defects"]),
                        "defects": response["defects"],
                    },
                )
            except Exception:
                self.send_json(
                    500,
                    {
                        "status": "error",
                        "message": "Unable to load defects.",
                    },
                )
            return

        if self.path == "/api/intelligence":
            try:
                response = get_dashboard_response()
                self.send_json(
                    200,
                    {
                        "status": "success",
                        "count": len(response["intelligence"]),
                        "intelligence": response["intelligence"],
                    },
                )
            except Exception:
                self.send_json(
                    500,
                    {
                        "status": "error",
                        "message": "Unable to load intelligence.",
                    },
                )
            return

        if self.path == "/api/analytics":
            try:
                response = get_dashboard_response()
                self.send_json(
                    200,
                    {
                        "status": "success",
                        "analytics": response["analytics"],
                    },
                )
            except Exception:
                self.send_json(
                    500,
                    {
                        "status": "error",
                        "message": "Unable to load analytics.",
                    },
                )
            return

        self.send_error_json(404, "Endpoint not found.")

    def log_message(self, format, *args):
        print(f"[API] {self.address_string()} - {format % args}")


def create_server():
    return ThreadingHTTPServer(
        (HOST, PORT),
        DefectSenseHandler,
    )


if __name__ == "__main__":
    server = create_server()

    print(f"DefectSense AI API running on http://{HOST}:{PORT}")
    print("Endpoints:")
    print("  GET /health")
    print("  GET /api/dashboard")
    print("  GET /api/claims")
    print("  GET /api/defects")
    print("  GET /api/intelligence")
    print("  GET /api/analytics")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping DefectSense AI API...")
    finally:
        server.server_close()
