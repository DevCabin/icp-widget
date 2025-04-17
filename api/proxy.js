import puppeteer from 'puppeteer-core';
import chrome from '@sparticuz/chromium';

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

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    let browser = null;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
            ignoreHTTPSErrors: true,
        });

        console.log('Creating new page...');
        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1280, height: 800 });

        console.log('Navigating to URL:', decodeURIComponent(url));
        await page.goto(decodeURIComponent(url), { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for 3 seconds to allow Angular to render
        console.log('Waiting for 3 seconds...');
        await page.waitForTimeout(3000);

        // Wait for class cards to be visible
        console.log('Waiting for class cards...');
        await page.waitForSelector('article.card', { timeout: 5000 });

        // Get the classes HTML
        console.log('Extracting class data...');
        const classes = await page.evaluate(() => {
            const cards = document.querySelectorAll('article.card');
            return Array.from(cards).map(card => {
                const title = card.querySelector('h3')?.textContent || 'Untitled Class';
                const description = card.querySelector('p')?.textContent || 'No description available';
                return {
                    name: title,
                    description: description
                };
            });
        });

        console.log('Found classes:', classes.length);
        return res.status(200).json({ classes });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch data',
            message: error.message,
            stack: error.stack
        });
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
}
