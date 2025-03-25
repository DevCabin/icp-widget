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

    // Get query parameters
    const { accountName, param1, param2, param3, param4 } = req.query;

    // Validate required parameters
    if (!accountName || !param1 || !param2) {
        res.status(400).json({ 
            error: 'Missing required parameters. Please provide accountName, param1, and param2.' 
        });
        return;
    }

    // Construct the URL
    let url = `https://${accountName}.iclasspro.com/portal/classes?${param1}&${param2}`;
    if (param3) url += `&${param3}`;
    if (param4) url += `&${param4}`;

    console.log('Fetching URL:', url);

    let browser = null;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true
        });

        // Create new page
        const page = await browser.newPage();
        
        // Navigate to URL
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for content
        await page.waitForSelector('article.card .card-body', { timeout: 10000 });

        // Extract the HTML content
        const classes = await page.evaluate(() => {
            const cards = document.querySelectorAll('article.card .card-body');
            return Array.from(cards).map(card => ({
                html: card.innerHTML
            }));
        });

        // Return the extracted content
        res.json({ classes });

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch class data',
            message: error.message
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
