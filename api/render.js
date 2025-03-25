import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
    console.log('Render endpoint received request:', {
        method: req.method,
        url: req.url,
        query: req.query,
        headers: req.headers,
        timestamp: new Date().toISOString()
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/html');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        console.log('Method not allowed:', req.method);
        return res.status(405).send('Method not allowed');
    }

    const { accountName, param1, param2, param3, param4 } = req.query;
    console.log('Processing request with parameters:', {
        accountName,
        param1,
        param2,
        param3,
        param4
    });

    if (!accountName) {
        console.log('Missing required parameter: accountName');
        return res.status(400).send('Missing required parameter: accountName');
    }

    let browser = null;
    try {
        // Launch Puppeteer
        console.log('Launching Puppeteer...');
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });
        console.log('Puppeteer launched successfully');

        try {
            console.log('Creating new page...');
            const page = await browser.newPage();
            console.log('New page created');

            // Set viewport
            console.log('Setting viewport...');
            await page.setViewport({ width: 1200, height: 800 });
            console.log('Viewport set');

            // Navigate to the page
            let url = `https://portal.iclasspro.com/${accountName}/classes`;
            if (param1) url += `?${param1}`;
            if (param2) url += `${param1 ? '&' : '?'}${param2}`;
            if (param3) url += `&${param3}`;
            if (param4) url += `&${param4}`;
            
            console.log('Navigating to page:', url);
            await page.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            console.log('Page navigation complete');

            // Wait for the content to load
            console.log('Waiting for content to load...');
            await page.waitForSelector('article.card .card-body', { timeout: 10000 });
            console.log('Content loaded');

            // Wait for any loading states to complete
            console.log('Waiting for loading states to complete...');
            await page.waitForTimeout(2000);
            console.log('Loading states complete');

            // Get the content
            console.log('Getting page content...');
            const content = await page.content();
            console.log('Page content retrieved');

            // Clean up
            console.log('Closing browser...');
            await browser.close();
            console.log('Browser closed');

            // Send response
            console.log('Sending response...');
            return res.status(200).send(content);
        } catch (error) {
            console.error('Error during page processing:', error);
            if (browser) await browser.close();
            return res.status(500).send(`Error processing page: ${error.message}`);
        }
    } catch (error) {
        console.error('Error launching browser:', error);
        if (browser) await browser.close();
        return res.status(500).send(`Error launching browser: ${error.message}`);
    }
} 