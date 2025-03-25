const puppeteer = require('puppeteer-core');
const chrome = require('@sparticuz/chromium');

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

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { accountName, param1, param2, param3, param4 } = req.query;

    if (!accountName) {
        return res.status(400).json({ error: 'Account name is required' });
    }

    let browser = null;
    try {
        // Construct the URL with query parameters
        let url = `https://portal.iclasspro.com/${accountName}/classes`;
        if (param1) url += `?${param1}`;
        if (param2) url += `${param1 ? '&' : '?'}${param2}`;
        if (param3) url += `&${param3}`;
        if (param4) url += `&${param4}`;

        console.log('Fetching URL:', url);

        // Launch browser with special configuration for serverless
        browser = await puppeteer.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1280, height: 800 });

        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for the classes to load
        await page.waitForSelector('article.card .card-body', { timeout: 10000 });

        // Get the full HTML content
        const html = await page.evaluate(() => {
            // Remove any scripts that might cause issues
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                script.remove();
            }
            
            // Get the main content area
            const mainContent = document.querySelector('main') || document.body;
            return mainContent.innerHTML;
        });

        // Return the HTML with some basic styling
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    }
                    main {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .card {
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 15px;
                        background: white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }
                </style>
            </head>
            <body>
                <main>
                    ${html}
                </main>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Detailed Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        return res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        text-align: center;
                        color: #ff4444;
                    }
                </style>
            </head>
            <body>
                <h2>Error loading classes 😢</h2>
                <p>Please try again later</p>
            </body>
            </html>
        `);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
} 