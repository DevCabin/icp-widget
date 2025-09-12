# api/iclasspro.py
from http.server import BaseHTTPRequestHandler
import requests
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse account from query params
        account = self.path.split('account=')[1] if 'account=' in self.path else 'demo'
        
        # Make request to iClassPro
        iclasspro_url = f"https://portal.iclasspro.com/{account}/classes"
        
        try:
            response = requests.get(iclasspro_url)
            data = response.json() if response.headers.get('content-type', '').startswith('application/json') else []
        except:
            data = []
        
        # Return with CORS headers
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())