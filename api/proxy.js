const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const url = req.query.url;
    if (!url) {
        res.status(400).json({ error: 'Missing url parameter' });
        return;
    }

    let browser = null;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
        });

        // Create new page
        const page = await browser.newPage();
        
        // Navigate to URL
        await page.goto(url, {
            waitUntil: 'networkidle0',  // Wait until network is idle
            timeout: 30000,  // 30 second timeout
        });

        // Wait additional time for Angular to render
        await page.waitForTimeout(3000);

        // Extract class cards
        const classes = await page.evaluate(() => {
            const cards = document.querySelectorAll('article.card .card-body');
            return Array.from(cards).map(card => ({
                html: card.innerHTML
            }));
        });

        res.json({ classes });
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
