const axios = require('axios');
const puppeteer = require('puppeteer');

module.exports = async function handler(req, res) {
    console.log('=== Starting render endpoint ===');
    
    try {
        // Set CORS headers
        console.log('Setting CORS headers');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            console.log('Handling OPTIONS request');
            res.status(200).end();
            return;
        }

        // Only allow GET requests
        if (req.method !== 'GET') {
            console.log('Invalid method:', req.method);
            res.status(405).send('Method not allowed');
            return;
        }

        // Log incoming request
        console.log('Request details:', {
            method: req.method,
            query: req.query,
            headers: req.headers
        });

        const { accountName, param1, param2, param3 } = req.query;

        // Validate required parameters
        if (!accountName) {
            console.error('Missing accountName parameter');
            res.status(400).send('Missing required parameter: accountName');
            return;
        }

        // Construct the URL
        console.log('Constructing URL with parameters:', { accountName, param1, param2, param3 });
        const baseUrl = `https://portal.iclasspro.com/${accountName}/classes`;
        const params = new URLSearchParams();
        
        try {
            if (param1) {
                const [key, value] = param1.split('=');
                console.log('Adding param1:', { key, value });
                params.append(key, value);
            }
            if (param2) {
                const [key, value] = param2.split('=');
                console.log('Adding param2:', { key, value });
                params.append(key, value);
            }
            if (param3) {
                const [key, value] = param3.split('=');
                console.log('Adding param3:', { key, value });
                params.append(key, value);
            }
        } catch (paramError) {
            console.error('Error parsing parameters:', paramError);
            res.status(400).send('Invalid parameter format');
            return;
        }

        const url = `${baseUrl}?${params.toString()}`;
        console.log('Final URL being sent to IClassPro:', url);

        // Launch Puppeteer
        console.log('Launching Puppeteer');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            
            // Set viewport and user agent
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

            // Navigate to the page
            console.log('Navigating to page');
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait for the content to load
            console.log('Waiting for content to load');
            await page.waitForSelector('.card-body', { timeout: 10000 });

            // Extract card bodies
            console.log('Extracting card bodies');
            const cardBodies = await page.evaluate(() => {
                const cards = document.querySelectorAll('.card-body');
                return Array.from(cards).map(card => card.innerHTML);
            });

            console.log(`Found ${cardBodies.length} card bodies`);

            // Create response HTML
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
                    </style>
                </head>
                <body>
                    ${cardBodies.length ? cardBodies.join('\n') : `
                        <div style="text-align: center; padding: 20px;">
                            <div style="color: #666; font-size: 18px;">Loading classes...</div>
                            <div style="color: #999; font-size: 14px;">Please wait while we fetch the latest schedule</div>
                        </div>
                    `}
                    <script>
                        function updateHeight() {
                            const height = document.body.scrollHeight;
                            window.parent.postMessage({ type: 'iframeHeight', height }, '*');
                        }
                        window.addEventListener('load', updateHeight);
                        const observer = new MutationObserver(updateHeight);
                        observer.observe(document.body, { childList: true, subtree: true });
                    </script>
                </body>
                </html>
            `;

            // Send response
            console.log('Sending response');
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(html);

        } finally {
            await browser.close();
        }

    } catch (error) {
        console.error('=== Render endpoint error ===');
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
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
                        max-width: 600px;
                    }
                    .error-message {
                        color: #dc3545;
                        font-size: 18px;
                        margin-bottom: 10px;
                    }
                    .error-details {
                        color: #666;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    .error-code {
                        font-family: monospace;
                        background: #f8f9fa;
                        padding: 10px;
                        border-radius: 4px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="error-container">
                    <div class="error-message">Unable to load classes</div>
                    <div class="error-details">An error occurred while fetching the schedule</div>
                    <div class="error-code">${error.message}</div>
                </div>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(errorHtml);
    }
}