import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    // Log the incoming request
    console.log('Render endpoint called with query:', req.query);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).send('Method not allowed');
        return;
    }

    try {
        const { accountName, param1, param2, param3, param4 } = req.query;

        // Validate required parameters
        if (!accountName) {
            console.error('Missing required parameter: accountName');
            res.status(400).send('Missing required parameter: accountName');
            return;
        }

        // Construct the URL
        const baseUrl = `https://portal.iclasspro.com/${accountName}/classes`;
        const params = new URLSearchParams();
        if (param1) params.append(param1.split('=')[0], param1.split('=')[1]);
        if (param2) params.append(param2.split('=')[0], param2.split('=')[1]);
        if (param3) params.append(param3.split('=')[0], param3.split('=')[1]);
        if (param4) params.append(param4.split('=')[0], param4.split('=')[1]);

        const url = `${baseUrl}?${params.toString()}`;
        console.log('Fetching URL:', url);

        // Fetch the page content
        console.log('Making request to IClassPro...');
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log('Response received:', {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            dataLength: response.data.length,
            firstChars: response.data.substring(0, 200) // First 200 chars for debugging
        });

        // Load the HTML into cheerio
        console.log('Loading HTML into cheerio...');
        const $ = cheerio.load(response.data);

        // Extract the card bodies
        console.log('Extracting card bodies...');
        const cardBodies = $('.card-body').map((i, el) => $(el).html()).get();
        console.log(`Found ${cardBodies.length} card bodies`);

        // Create a clean HTML response
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
                    .card-body {
                        background: white;
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 4px;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                ${cardBodies.join('\n')}
                <script>
                    // Send height to parent window
                    function updateHeight() {
                        const height = document.body.scrollHeight;
                        window.parent.postMessage({ type: 'iframeHeight', height }, '*');
                    }
                    
                    // Update height on load and when content changes
                    window.addEventListener('load', updateHeight);
                    const observer = new MutationObserver(updateHeight);
                    observer.observe(document.body, { childList: true, subtree: true });
                </script>
            </body>
            </html>
        `;

        // Send the response
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        console.error('Render endpoint error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            } : null
        });
        
        // Send a user-friendly error response
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
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 200px;
                        background: #f5f5f5;
                    }
                    .error-container {
                        text-align: center;
                        padding: 20px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .error-message {
                        color: #dc3545;
                        font-size: 18px;
                        margin-bottom: 10px;
                    }
                    .error-details {
                        color: #666;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <div class="error-message">Unable to load classes</div>
                    <div class="error-details">Please try again later</div>
                </div>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(errorHtml);
    }
}