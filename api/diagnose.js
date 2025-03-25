import axios from 'axios';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Test URL - using a simple, reliable site first
        const url = 'https://api.github.com/zen';
        console.log('Making request to:', url);

        // Make request with detailed logging and browser-like headers
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Cache-Control': 'max-age=0',
                'Origin': 'http://localhost:3000',
                'Referer': 'http://localhost:3000/',
                'Host': new URL(url).host,
                'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            },
            timeout: 5000,
            validateStatus: function (status) {
                return status >= 200 && status < 500; // Accept any status less than 500
            }
        });

        // Log response details
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);

        // Create diagnostic response
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .section {
                        margin-bottom: 20px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 4px;
                    }
                    pre {
                        background: #f1f1f1;
                        padding: 10px;
                        border-radius: 4px;
                        overflow-x: auto;
                    }
                    .success {
                        color: #28a745;
                    }
                    .error {
                        color: #dc3545;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Diagnostic Results</h1>
                    <div class="section">
                        <h2>Request Details</h2>
                        <pre>URL: ${url}
Method: GET
Timeout: 5000ms</pre>
                    </div>
                    <div class="section">
                        <h2>Request Headers</h2>
                        <pre>${JSON.stringify(response.config.headers, null, 2)}</pre>
                    </div>
                    <div class="section">
                        <h2>Response Status</h2>
                        <pre class="${response.status < 400 ? 'success' : 'error'}">${response.status}</pre>
                    </div>
                    <div class="section">
                        <h2>Response Headers</h2>
                        <pre>${JSON.stringify(response.headers, null, 2)}</pre>
                    </div>
                    <div class="section">
                        <h2>Response Data</h2>
                        <pre>${JSON.stringify(response.data, null, 2)}</pre>
                    </div>
                </div>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        console.error('Diagnostic error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response ? {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            } : null
        });
        
        const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .error {
                        color: #dc3545;
                    }
                    pre {
                        background: #f1f1f1;
                        padding: 10px;
                        border-radius: 4px;
                        overflow-x: auto;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="error">Diagnostic Error</h1>
                    <div class="section">
                        <h2>Error Message</h2>
                        <pre>${error.message}</pre>
                    </div>
                    <div class="section">
                        <h2>Error Code</h2>
                        <pre>${error.code || 'N/A'}</pre>
                    </div>
                    ${error.response ? `
                    <div class="section">
                        <h2>Response Status</h2>
                        <pre>${error.response.status}</pre>
                    </div>
                    <div class="section">
                        <h2>Response Headers</h2>
                        <pre>${JSON.stringify(error.response.headers, null, 2)}</pre>
                    </div>
                    <div class="section">
                        <h2>Response Data</h2>
                        <pre>${JSON.stringify(error.response.data, null, 2)}</pre>
                    </div>
                    ` : ''}
                </div>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(errorHtml);
    }
} 