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
            args: [...chromium.args, '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });

        // Create new page
        const page = await browser.newPage();
        
        // Navigate to URL and wait for content
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Wait for Angular to render (wait for specific elements)
        await page.waitForSelector('article.card .card-body', { timeout: 10000 });

        // Additional wait to ensure dynamic content is loaded
        await page.waitForTimeout(2000);

        // Extract the HTML content
        const classCards = await page.evaluate(() => {
            const cards = document.querySelectorAll('article.card .card-body');
            return Array.from(cards).map(card => ({
                html: card.innerHTML,
                // Optionally extract specific data if needed
                title: card.querySelector('h3')?.textContent || '',
                description: card.querySelector('p')?.textContent || ''
            }));
        });

        // Return the extracted content
        res.json({ 
            success: true,
            classes: classCards,
            timestamp: new Date().toISOString()
        });

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
