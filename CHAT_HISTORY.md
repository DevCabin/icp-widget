# Chat History - IClassPro Widget Development

## April 4, 2024

### Key Points
- Project: IClassPro Widget for embedding class schedules
- Repository: https://github.com/DevCabin/icp-widget.git
- Current Status: v1.3.0 is now stable and ready for GitHub push

### Recent Changes
- Enhanced loading animation with 5 rotating icons (⚡ 🤸 🥷 🧘 ✨)
- Hidden "View Available Dates" links in the rendered content
- Removed unused modal functionality and related code
- Improved code organization and cleanup
- Updated documentation (README, CHANGELOG)

### Development Flow
1. Started with local development (which worked)
2. Deployed to Vercel and encountered issues
3. Learned that local development was misleading
4. Removed all local development references
5. Created diagnostic endpoint for troubleshooting
6. Implemented Puppeteer for server-side rendering
7. Enhanced loading animation and user experience
8. Cleaned up codebase and removed unused functionality

### Current Status
- v1.3.0 is now stable and ready for GitHub push
- Loading animation working correctly with 5 rotating icons
- "View Available Dates" links are hidden
- Performance timing logs are in place
- Error handling is improved

## March 25, 2024

### Key Points
- Project: IClassPro Widget for embedding class schedules
- Repository: https://github.com/DevCabin/icp-widget.git
- Current Status: Working on fixing 500 errors in production

### Development Flow
1. Started with local development (which worked)
2. Deployed to Vercel and encountered issues
3. Learned that local development was misleading
4. Removed all local development references
5. Created diagnostic endpoint for troubleshooting

### Current Issues
- 500 errors in production
- Vercel deployment limits (200 deploys/24h)
- Potential request blocking from IClassPro

### Recent Changes
1. Created diagnostic endpoint (`/api/diagnose.js`)
2. Added browser-like headers to mimic localhost requests
3. Updated vercel.json configuration
4. Simplified README

### Next Steps
1. Wait for Vercel deployment limits to reset
2. Test diagnostic endpoint at `/diagnose`
3. Apply successful headers to main render endpoint
4. Test with IClassPro URL

### Key Files
- `api/render.js`: Main widget endpoint
- `api/diagnose.js`: Diagnostic endpoint
- `vercel.json`: Deployment configuration
- `public/icp-widget.js`: Client-side widget code

### Browser Headers Added
```javascript
{
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0',
    'Origin': 'http://localhost:3000',
    'Referer': 'http://localhost:3000/',
    'Host': new URL(url).host,
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"'
}
```

### Important Notes
- Local development worked but was misleading
- Production environment has different requirements
- Need to focus on production-first development
- Diagnostic endpoint will help identify exact issues 

## April 2024 Update

### New Strategy Discussion
- Considered MCP integration but determined it wouldn't solve core challenges
- Reaffirmed project's core purpose: Creating a pseudo-API for IClassPro
- Explored dedicated proxy server approach vs. serverless

### Proposed Architecture (Minimal Overhead Version)
1. **Smart Caching Strategy**:
   - Utilize browser-side caching with Cache API
   - Short cache duration (5 minutes)
   - Client-side cache management

2. **Minimal Server Storage**:
   - Small in-memory LRU cache (last 100 requests)
   - Short TTL (30-60 seconds)
   - Handles concurrent request deduplication

3. **Request Deduplication**:
   - Map of pending requests
   - Prevents duplicate concurrent requests
   - Automatic cleanup

4. **Load Management**:
   - Browser instance pooling
   - Auto-scaling pool (2-10 instances)
   - Request queuing with timeouts

5. **Client-Side Caching Headers**:
   - Standard HTTP caching mechanisms
   - ETags for validation
   - Cache-Control headers

### Key Benefits
- Minimal server overhead
- Scalable to potential 50M users
- No growing storage requirements
- Efficient resource usage
- Browser-based caching reduces server load

### Next Steps
1. Return to basic minimal working version
2. Test locally first
3. Then attempt Vercel deployment
4. Implement new architecture once basics are working

### Code Snippets for Future Implementation

```javascript
// Client-side caching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function fetchClasses(accountName, params) {
  const cacheKey = `icp-${accountName}-${JSON.stringify(params)}`;
  
  // Check browser cache first
  const cachedData = await cacheStorage.match(cacheKey);
  if (cachedData) {
    const data = await cachedData.json();
    if (Date.now() - data.timestamp < CACHE_DURATION) {
      return data.content;
    }
  }

  // If not cached or expired, fetch from proxy
  const response = await fetch('/proxy/classes', {
    headers: {
      'Cache-Control': 'max-age=300',
    }
  });
  
  // Store in browser cache
  const data = await response.json();
  await cacheStorage.put(cacheKey, new Response(JSON.stringify({
    content: data,
    timestamp: Date.now()
  })));
  
  return data;
}

// Server-side LRU cache
const LRU = require('lru-cache');
const cache = new LRU({
  max: 100,
  maxAge: 60 * 1000
});

// Request deduplication
const pendingRequests = new Map();

async function handleRequest(accountName, params) {
  const key = `${accountName}-${JSON.stringify(params)}`;
  
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = fetchFromIClassPro(accountName, params);
  pendingRequests.set(key, promise);
  
  try {
    const result = await promise;
    return result;
  } finally {
    pendingRequests.delete(key);
  }
}

// Browser pool management
const pool = new BrowserPool({
  min: 2,
  max: 10,
  idleTimeoutMillis: 30000,
  acquireTimeoutMillis: 5000
});

// Response headers for client caching
res.set({
  'Cache-Control': 'public, max-age=300',
  'ETag': computeHash(data),
  'Vary': 'Accept-Encoding',
  'Expires': new Date(Date.now() + 300000).toUTCString()
});
``` 