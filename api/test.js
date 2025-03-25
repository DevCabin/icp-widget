import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        console.log('Fetching Google...');
        const response = await axios.get('https://www.google.com', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 10000
        });

        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);

        // Get the title and some basic content
        const title = $('title').text();
        const searchBox = $('#searchform').html() || 'Search form not found';
        const footer = $('#footer').html() || 'Footer not found';

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
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #4285f4;
                        margin-bottom: 20px;
                    }
                    .section {
                        margin-bottom: 20px;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 4px;
                    }
                    .section h2 {
                        color: #333;
                        margin-top: 0;
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
                    <h1>Test Page - Google.com Content</h1>
                    <div class="section">
                        <h2>Page Title</h2>
                        <pre>${title}</pre>
                    </div>
                    <div class="section">
                        <h2>Search Form</h2>
                        <pre>${searchBox}</pre>
                    </div>
                    <div class="section">
                        <h2>Footer</h2>
                        <pre>${footer}</pre>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send the response
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        console.error('Test endpoint error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
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
                    <div class="error-message">Test Failed</div>
                    <div class="error-details">Error: ${error.message}</div>
                </div>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(500).send(errorHtml);
    }
} 