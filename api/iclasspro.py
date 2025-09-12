from http.server import BaseHTTPRequestHandler
import requests
import json
import re
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
                # Parse HTML response to extract class data
                html_content = response.text
                print(f"HTML content length: {len(html_content)}")
                
                # Look for JSON data in script tags or data attributes
                classes = []
                
                # Try to find JSON data in script tags
                script_pattern = r'<script[^>]*>.*?window\.__INITIAL_STATE__\s*=\s*({.*?});'
                script_match = re.search(script_pattern, html_content, re.DOTALL)
                
                if script_match:
                    try:
                        initial_state = json.loads(script_match.group(1))
                        print(f"Found initial state: {list(initial_state.keys())}")
                        # Extract classes from the state structure
                        if 'classes' in initial_state:
                            classes = initial_state['classes']
                        elif 'data' in initial_state and 'classes' in initial_state['data']:
                            classes = initial_state['data']['classes']
                    except json.JSONDecodeError as e:
                        print(f"Failed to parse initial state JSON: {e}")
                
                # If no classes found in scripts, try to extract from HTML structure
                if not classes:
                    # Look for class cards in HTML
                    class_pattern = r'<article[^>]*class="[^"]*card[^"]*"[^>]*>.*?</article>'
                    class_matches = re.findall(class_pattern, html_content, re.DOTALL)
                    print(f"Found {len(class_matches)} class cards in HTML")
                    
                    for match in class_matches:
                        # Extract basic info from HTML
                        name_match = re.search(r'<h[1-6][^>]*>([^<]+)</h[1-6]>', match)
                        desc_match = re.search(r'<p[^>]*>([^<]+)</p>', match)
                        
                        if name_match:
                            classes.append({
                                'name': name_match.group(1).strip(),
                                'description': desc_match.group(1).strip() if desc_match else '',
                                'source': 'html_parsing'
                            })
                
                data = {
                    "classes": classes,
                    "total": len(classes),
                    "source": "html_parsing",
                    "content_type": response.headers.get('content-type'),
                    "status": response.status_code
                }
        except Exception as e:
            print("Error fetching from iClassPro:", e)
            data = {"error": str(e)}
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
