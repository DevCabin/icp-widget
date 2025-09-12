const axios = require('axios');

async function fetchClassesFromAPI(accountName, params = {}) {
    // Build query string manually
    const queryParts = [`locationId=1`, `limit=50`, `page=1`];
    
    // Add any additional params
    Object.entries(params).forEach(([key, value]) => {
        queryParts.push(`${key}=${value}`);
    });

    const url = `https://app.iclasspro.com/api/open/v1/${accountName}/classes?${queryParts.join('&')}`;
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

module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

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
                params: apiParams,
                url: `https://app.iclasspro.com/api/open/v1/${accountName}/classes`
            }
        });

    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });

        return res.status(500).json({
            error: 'Failed to fetch data',
            message: error.message,
            details: error.response?.data || error.stack,
            query: req.query
        });
    }
}; 