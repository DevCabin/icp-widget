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

        # Use the same API endpoint as V1 (which worked!)
        api_url = f"https://app.iclasspro.com/api/open/v1/{account}/classes?locationId=1&limit=50&page=1"
        
        # Add programs and levels if provided (like V1)
        if programs != '56':  # Only add if not default
            api_url += f"&programs={programs}"
        if genders != '2':  # Only add if not default  
            api_url += f"&levels={genders}"
            
        iclasspro_url = api_url
        print(f"Using V1 API approach: {iclasspro_url}")
        try:
            print(f"Fetching from: {iclasspro_url}")
            response = requests.get(iclasspro_url, headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'Accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': 'https://portal.iclasspro.com/',
                'Origin': 'https://portal.iclasspro.com'
            })
            print(f"Response status: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            print(f"Response content type: {response.headers.get('content-type', 'unknown')}")
            print(f"Response text (first 200 chars): {response.text[:200]}")
            
            if response.headers.get('content-type', '').startswith('application/json'):
                api_response = response.json()
                print(f"API response: {api_response}")
                
                # Transform the API response to match V1 format
                if 'data' in api_response and api_response['data']:
                    classes = []
                    for classItem in api_response['data']:
                        classes.append({
                            'id': classItem.get('id', ''),
                            'name': classItem.get('name', ''),
                            'schedule': classItem.get('schedule', ''),
                            'openings': classItem.get('openings', 0),
                            'allowWaitlist': classItem.get('allowWaitlist', False),
                            'instructors': classItem.get('instructors', []),
                            'startDate': classItem.get('startDate', ''),
                            'endDate': classItem.get('endDate', ''),
                            'description': classItem.get('description', ''),
                            'capacity': classItem.get('capacity', 0),
                            'enrolled': classItem.get('enrolled', 0),
                            'price': classItem.get('price', '')
                        })
                    
                    data = {
                        "classes": classes,
                        "total": len(classes),
                        "totalRecords": api_response.get('totalRecords', 0),
                        "source": "iclasspro_api_v1_method",
                        "status": response.status_code
                    }
                else:
                    data = {
                        "classes": [],
                        "total": 0,
                        "totalRecords": api_response.get('totalRecords', 0),
                        "source": "iclasspro_api_v1_method",
                        "status": response.status_code,
                        "message": "No classes found in API response"
                    }
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
                    # Try multiple HTML patterns for class cards
                    html_patterns = [
                        r'<article[^>]*class="[^"]*card[^"]*"[^>]*>.*?</article>',
                        r'<div[^>]*class="[^"]*class[^"]*"[^>]*>.*?</div>',
                        r'<div[^>]*class="[^"]*item[^"]*"[^>]*>.*?</div>',
                        r'<li[^>]*class="[^"]*class[^"]*"[^>]*>.*?</li>',
                        r'<div[^>]*class="[^"]*course[^"]*"[^>]*>.*?</div>',
                        r'<div[^>]*class="[^"]*program[^"]*"[^>]*>.*?</div>',
                    ]
                    
                    for pattern in html_patterns:
                        matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)
                        print(f"Found {len(matches)} matches with pattern: {pattern[:50]}...")
                        
                        if matches:
                            for i, match in enumerate(matches):
                                # Extract more detailed info from HTML
                                name_match = re.search(r'<h[1-6][^>]*>([^<]+)</h[1-6]>', match, re.IGNORECASE)
                                desc_match = re.search(r'<p[^>]*>([^<]+)</p>', match, re.IGNORECASE)
                                
                                # Look for time/date info
                                time_match = re.search(r'(\d{1,2}:\d{2}\s*[AP]M)', match, re.IGNORECASE)
                                day_match = re.search(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)', match, re.IGNORECASE)
                                
                                # Look for instructor info
                                instructor_match = re.search(r'(Instructor|Teacher|Coach)[:\s]*([^<\n]+)', match, re.IGNORECASE)
                                
                                # Look for price info
                                price_match = re.search(r'(\$\d+(?:\.\d{2})?(?:/\w+)?)', match)
                                
                                if name_match:
                                    class_data = {
                                        'id': f'class_{i+1}',
                                        'name': name_match.group(1).strip(),
                                        'description': desc_match.group(1).strip() if desc_match else '',
                                        'source': 'html_parsing'
                                    }
                                    
                                    if time_match:
                                        class_data['time'] = time_match.group(1)
                                    if day_match:
                                        class_data['date'] = day_match.group(1)
                                    if instructor_match:
                                        class_data['instructor'] = instructor_match.group(2).strip()
                                    if price_match:
                                        class_data['price'] = price_match.group(1)
                                    
                                    classes.append(class_data)
                            
                            if classes:
                                break
                
                # If no classes found in HTML, return empty array
                if len(classes) == 0:
                    print("No classes found in HTML - iClassPro requires JavaScript rendering")
                    classes = []
                
                data = {
                    "classes": classes,
                    "total": len(classes),
                    "source": "demo_fallback" if len(classes) > 0 and classes[0].get('id', '').startswith('demo_') else "html_parsing",
                    "content_type": response.headers.get('content-type'),
                    "status": response.status_code,
                    "note": "Using demo data - iClassPro requires JavaScript rendering for live data" if len(classes) > 0 and classes[0].get('id', '').startswith('demo_') else "Parsed from HTML"
                }
        except Exception as e:
            print("Error fetching from API endpoint:", e)
            # Try API without restrictive parameters
            try:
                simple_api_url = f"https://app.iclasspro.com/api/open/v1/{account}/classes?locationId=1&limit=24&page=1"
                print(f"Trying simple API: {simple_api_url}")
                response = requests.get(simple_api_url, headers={
                    'User-Agent': 'Mozilla/5.0 (compatible; ICP-Widget/1.0)',
                    'Accept': 'application/json, text/html, */*'
                })
                
                if response.headers.get('content-type', '').startswith('application/json'):
                    api_response = response.json()
                    print(f"Simple API response: {api_response}")
                    
                    if 'data' in api_response and api_response['data']:
                        classes = api_response['data']
                        data = {
                            "classes": classes,
                            "total": len(classes),
                            "totalRecords": api_response.get('totalRecords', 0),
                            "source": "iclasspro_api_simple",
                            "status": response.status_code
                        }
                    else:
                        # Still no data, use demo
                        data = {
                            "classes": [
                                {
                                    "name": "Water Babies (Parent & Me)",
                                    "instructor": "Sarah Martinez",
                                    "time": "10:00 AM - 10:30 AM",
                                    "date": "Monday & Wednesday",
                                    "description": "Gentle introduction to water for infants and toddlers with parent participation.",
                                    "ageGroup": "Ages 6 months - 2 years",
                                    "capacity": 8,
                                    "enrolled": 6,
                                    "price": "$65/month"
                                },
                                {
                                    "name": "Beginner Swimmers",
                                    "instructor": "Coach Mike Thompson", 
                                    "time": "4:00 PM - 4:30 PM",
                                    "date": "Tuesday & Thursday",
                                    "description": "Learn basic water safety, floating, and beginning stroke techniques.",
                                    "ageGroup": "Ages 3-5",
                                    "capacity": 6,
                                    "enrolled": 5,
                                    "price": "$75/month"
                                }
                            ],
                            "total": 2,
                            "source": "demo_fallback",
                            "note": "No classes found in API - using demo data"
                        }
                else:
                    raise Exception("Simple API also returned non-JSON")
            except Exception as e2:
                print("Simple API also failed:", e2)
                # Try the portal URL as fallback
            try:
                print(f"Trying portal fallback: {portal_url}")
                response = requests.get(portal_url, headers={
                    'User-Agent': 'Mozilla/5.0 (compatible; ICP-Widget/1.0)',
                    'Accept': 'application/json, text/html, */*'
                })
                
                if response.headers.get('content-type', '').startswith('application/json'):
                    data = response.json()
                else:
                    # Return demo data for now
                    data = {
                        "classes": [
                            {
                                "name": "Water Babies (Parent & Me)",
                                "instructor": "Sarah Martinez",
                                "time": "10:00 AM - 10:30 AM",
                                "date": "Monday & Wednesday",
                                "description": "Gentle introduction to water for infants and toddlers with parent participation.",
                                "ageGroup": "Ages 6 months - 2 years",
                                "capacity": 8,
                                "enrolled": 6,
                                "price": "$65/month"
                            },
                            {
                                "name": "Beginner Swimmers",
                                "instructor": "Coach Mike Thompson", 
                                "time": "4:00 PM - 4:30 PM",
                                "date": "Tuesday & Thursday",
                                "description": "Learn basic water safety, floating, and beginning stroke techniques.",
                                "ageGroup": "Ages 3-5",
                                "capacity": 6,
                                "enrolled": 5,
                                "price": "$75/month"
                            }
                        ],
                        "total": 2,
                        "source": "demo_fallback",
                        "note": "Using demo data - API parsing needs adjustment"
                    }
            except Exception as e2:
                print("Portal fallback also failed:", e2)
                data = {"error": str(e), "fallback_error": str(e2)}
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
