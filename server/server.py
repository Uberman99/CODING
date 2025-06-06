import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

CLIENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'client')

MOCK_MEALS = [
    {
        "name": "Breakfast",
        "calories": 400,
        "price": 3.5,
        "macros": {"protein": 20, "carbs": 50, "fat": 10}
    },
    {
        "name": "Lunch",
        "calories": 600,
        "price": 5.0,
        "macros": {"protein": 25, "carbs": 70, "fat": 15}
    },
    {
        "name": "Dinner",
        "calories": 700,
        "price": 6.0,
        "macros": {"protein": 30, "carbs": 80, "fat": 20}
    }
]

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=CLIENT_DIR, **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_POST(self):
        if self.path == '/api/mealplan':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode('utf-8')
            try:
                params = json.loads(body)
            except json.JSONDecodeError:
                params = {}
            plan = self.generate_plan(params)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(plan).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def generate_plan(self, params):
        meals = MOCK_MEALS[:params.get('mealsPerDay', 3)]
        total_price = sum(m['price'] for m in meals)
        return {"meals": meals, "total_price": total_price}


def run(server_class=HTTPServer, handler_class=Handler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Serving on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
