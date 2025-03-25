const puppeteer = require('puppeteer-core');
const chrome = require('@sparticuz/chromium');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { accountName, param1, param2, param3, param4 } = req.query;

    if (!accountName) {
        return res.status(400).json({ error: 'Account name is required' });
    }

    try {
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
        const url = `https://app.iclasspro.com/portal/${accountName}/classes`;
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for the classes to load
        await page.waitForSelector('.class-list', { timeout: 10000 });

        // Get the classes HTML
        const classes = await page.evaluate(() => {
            const classElements = document.querySelectorAll('.class-list .class-item');
            return Array.from(classElements).map(el => ({
                html: el.outerHTML
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
