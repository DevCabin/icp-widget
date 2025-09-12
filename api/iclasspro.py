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
                
                # Log a sample of the HTML to understand the structure
                print(f"HTML sample (first 1000 chars): {html_content[:1000]}")
                
                # Look for JSON data in script tags or data attributes
                classes = []
                
                # Try multiple patterns for finding JSON data in scripts
                patterns = [
                    r'window\.__INITIAL_STATE__\s*=\s*({.*?});',
                    r'window\.__APOLLO_STATE__\s*=\s*({.*?});',
                    r'window\.__DATA__\s*=\s*({.*?});',
                    r'var\s+classes\s*=\s*(\[.*?\]);',
                    r'const\s+classes\s*=\s*(\[.*?\]);',
                    r'"classes":\s*(\[.*?\])',
                ]
                
                for pattern in patterns:
                    script_match = re.search(pattern, html_content, re.DOTALL)
                    if script_match:
                        try:
                            json_data = json.loads(script_match.group(1))
                            print(f"Found JSON data with pattern: {pattern[:30]}...")
                            print(f"JSON keys: {list(json_data.keys()) if isinstance(json_data, dict) else 'Array'}")
                            
                            # Extract classes from different possible structures
                            if isinstance(json_data, list):
                                classes = json_data
                            elif isinstance(json_data, dict):
                                if 'classes' in json_data:
                                    classes = json_data['classes']
                                elif 'data' in json_data and 'classes' in json_data['data']:
                                    classes = json_data['data']['classes']
                                elif 'items' in json_data:
                                    classes = json_data['items']
                            
                            if classes:
                                break
                        except json.JSONDecodeError as e:
                            print(f"Failed to parse JSON with pattern {pattern[:30]}: {e}")
                            continue
                
                # If no classes found in scripts, try to extract from HTML structure
                if not classes:
                    # Try multiple HTML patterns
                    html_patterns = [
                        r'<article[^>]*class="[^"]*card[^"]*"[^>]*>.*?</article>',
                        r'<div[^>]*class="[^"]*class[^"]*"[^>]*>.*?</div>',
                        r'<div[^>]*class="[^"]*item[^"]*"[^>]*>.*?</div>',
                        r'<li[^>]*class="[^"]*class[^"]*"[^>]*>.*?</li>',
                    ]
                    
                    for pattern in html_patterns:
                        matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)
                        print(f"Found {len(matches)} matches with pattern: {pattern[:50]}...")
                        
                        if matches:
                            for match in matches:
                                # Extract basic info from HTML
                                name_match = re.search(r'<h[1-6][^>]*>([^<]+)</h[1-6]>', match, re.IGNORECASE)
                                desc_match = re.search(r'<p[^>]*>([^<]+)</p>', match, re.IGNORECASE)
                                
                                if name_match:
                                    classes.append({
                                        'name': name_match.group(1).strip(),
                                        'description': desc_match.group(1).strip() if desc_match else '',
                                        'source': 'html_parsing'
                                    })
                            
                            if classes:
                                break
                
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
