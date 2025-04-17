const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// Serve static files
app.use(express.static('public'));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Helper function to fetch classes from ICP API
async function fetchClassesFromAPI(accountName, params = {}) {
    const baseUrl = 'https://app.iclasspro.com/api/open/v1';
    const queryParams = new URLSearchParams({
        locationId: '1',
        limit: '50',
        page: '1',
        ...params
    });

    const url = `${baseUrl}/${accountName}/classes?${queryParams}`;
    console.log('Fetching from API:', url);

    const response = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://portal.iclasspro.com/',
            'Origin': 'https://portal.iclasspro.com'
        }
    });

    return response.data;
}

// Test endpoint
app.get('/test', async (req, res) => {
    try {
        const data = await fetchClassesFromAPI('gymagination', {
            programs: '56',
            levels: '4'
        });
        
        console.log('API Response:', JSON.stringify(data, null, 2));
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: error.toString(),
            stack: error.stack
        });
    }
});

// Proxy endpoint
app.get('/api/proxy', async (req, res) => {
    const { accountName, ...params } = req.query;
    
    if (!accountName) {
        return res.status(400).json({ error: 'accountName parameter is required' });
    }

    try {
        // Extract programs and levels from params if they exist
        const apiParams = {};
        if (params.programs) apiParams.programs = params.programs;
        if (params.levels) apiParams.levels = params.levels;

        const data = await fetchClassesFromAPI(accountName, apiParams);
        
        // Transform the API response to our widget format
        const classes = data.data.map(classItem => ({
            id: classItem.id,
            name: classItem.name,
            schedule: classItem.schedule,
            openings: classItem.openings,
            allowWaitlist: classItem.allowWaitlist,
            instructors: classItem.instructors,
            startDate: classItem.startDate,
            endDate: classItem.endDate
        }));

        return res.json({ 
            classes,
            debug: {
                totalFound: data.data.length,
                params: apiParams
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: 'Failed to fetch data',
            message: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test`);
});
