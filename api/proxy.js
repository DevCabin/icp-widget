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

    try {
        // Construct the URL with query parameters
        let url = `https://portal.iclasspro.com/${accountName}/classes`;
        if (param1) url += `?${param1}`;
        if (param2) url += `${param1 ? '&' : '?'}${param2}`;
        if (param3) url += `&${param3}`;
        if (param4) url += `&${param4}`;

        console.log('Fetching URL:', url);

        // Launch browser with special configuration for serverless
        const browser = await puppeteer.launch({
            args: chrome.args,
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

        // Get the classes HTML
        const classes = await page.evaluate(() => {
            const cards = document.querySelectorAll('article.card .card-body');
            return Array.from(cards).map(card => ({
                html: card.outerHTML
            }));
        });

        await browser.close();

        return res.status(200).json({ classes });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch class data',
            message: error.message
        });
    }
}
