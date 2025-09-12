const chromium = require('chrome-aws-lambda');

module.exports = async function handler(req, res) {
    let browser = null;
    
    try {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }

        const { accountName } = req.query;
        if (!accountName) {
            return res.status(400).send('Missing accountName parameter');
        }

        const url = `https://portal.iclasspro.com/${accountName}/classes`;
        console.log('Loading URL:', url);

        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

        console.log('Navigating to page...');
        await page.goto(url, { waitUntil: 'networkidle0' });

        console.log('Waiting for content...');
        await page.waitForSelector('.card-body');

        console.log('Extracting content...');
        const cardBodies = await page.evaluate(() => {
            const cards = document.querySelectorAll('.card-body');
            return Array.from(cards).map(card => card.innerHTML);
        });

        console.log(`Found ${cardBodies.length} cards`);

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        font-family: system-ui;
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
                ${cardBodies.join('\n')}
                <script>
                    const updateHeight = () => window.parent.postMessage({ type: 'iframeHeight', height: document.body.scrollHeight }, '*');
                    window.addEventListener('load', updateHeight);
                    new MutationObserver(updateHeight).observe(document.body, { childList: true, subtree: true });
                </script>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: system-ui; padding: 20px; text-align: center; }
                    .error { color: #dc3545; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="error">Failed to load classes: ${error.message}</div>
            </body>
            </html>
        `);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}