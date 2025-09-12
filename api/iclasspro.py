from http.server import BaseHTTPRequestHandler
import requests
import json
from urllib.parse import parse_qs, urlparse

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        qs = parse_qs(urlparse(self.path).query)
        account = qs.get('account', ['demo'])[0]
        genders = qs.get('genders', ['2'])[0]  # Default to '2' like V1
        programs = qs.get('programs', ['56'])[0]  # Default to '56' like V1

        # Make request to iClassPro with required parameters
        iclasspro_url = f"https://portal.iclasspro.com/{account}/classes?genders={genders}&programs={programs}"
        try:
            print(f"Fetching from: {iclasspro_url}")
            response = requests.get(iclasspro_url, headers={
                'User-Agent': 'Mozilla/5.0 (compatible; ICP-Widget/1.0)',
                'Accept': 'application/json, text/html, */*'
            })
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            print(f"Response content type: {response.headers.get('content-type', 'unknown')}")
            print(f"Response text (first 200 chars): {response.text[:200]}")
            
            if response.headers.get('content-type', '').startswith('application/json'):
                data = response.json()
            else:
                data = {"error": "Not JSON response", "content_type": response.headers.get('content-type'), "status": response.status_code}
        except Exception as e:
            print("Error fetching from iClassPro:", e)
            data = {"error": str(e)}
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
