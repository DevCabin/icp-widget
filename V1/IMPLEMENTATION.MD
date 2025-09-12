# IClassPro Widget Implementation Guide

This document outlines the implementation plan for modernizing the IClassPro widget while maintaining its core functionality and improving its architecture.

## Overview

The implementation modernizes the widget by:
- Converting to a React-based architecture
- Maintaining direct API integration
- Improving styling with styled-components
- Adding comprehensive error handling
- Ensuring DUDA compatibility

## Implementation Phases

### Phase 1: Streamline API Integration (1-2 days)

#### Remove Server-Side Components
- Remove `server.js`
- Remove `api/proxy.js`
- Remove `api/render.js`

#### Create Direct API Client
File: `src/api/icpClient.js`
```javascript
class ICPClient {
    constructor(config) {
        this.accountName = config.accountName;
        this.locationId = config.locationId || '1';
        this.programId = config.programId;
        this.retryAttempts = config.retryAttempts || 3;
    }
    // ... API methods
}
```

Key Features:
- Direct API calls
- Retry logic
- Error handling
- Response transformation

### Phase 2: Modernize Build System (1 day)

#### Update Package Configuration
File: `package.json`
- Add React dependencies
- Add build tools
- Configure scripts

#### Create Build Pipeline
File: `webpack.config.js`
- Configure bundling
- Set up code splitting
- Add minification
- Configure CSS optimization

### Phase 3: Core Widget Implementation (2-3 days)

#### Create Widget Entry Point
File: `src/index.js`
```javascript
window.ICPWidget = {
    init: function(scriptSrc, element, config) {
        initWidget(element, config);
    }
};
```

#### Implement Core Components
Files:
- `src/components/ClassList.js`
- `src/components/ClassItem.js`
- `src/components/LoadingState.js`
- `src/components/ErrorDisplay.js`

Features:
- React components
- Styled-components
- Error boundaries
- Loading states

### Phase 4: DUDA Integration (1-2 days)

#### Create DUDA Wrapper
File: `src/duda/index.js`
- Initialize with DUDA's renderExternalApp
- Handle DUDA-specific configuration
- Implement responsive behaviors

#### Add Configuration Handler
File: `src/config/index.js`
- Parse DUDA parameters
- Validate configuration
- Set defaults

### Phase 5: Testing & Optimization (2 days)

#### Add Test Suite
Files:
- `tests/components/*.test.js`
- `tests/api/*.test.js`
- `tests/integration/*.test.js`

Features:
- Unit tests
- Integration tests
- API mocks

#### Performance Optimization
- Implement code splitting
- Add caching layer
- Optimize bundle size

### Phase 6: Documentation & Deployment (1 day)

#### Update Documentation
Files:
- Update README.md
- Update WALKTHROUGH.md
- Add JSDoc comments
- Create usage examples

#### Deployment Configuration
- Update vercel.json
- Configure CDN
- Set up monitoring

## Directory Structure

```
src/
├── api/
│   └── icpClient.js
├── components/
│   ├── ClassList.js
│   ├── ClassItem.js
│   ├── LoadingState.js
│   └── ErrorDisplay.js
├── config/
│   └── index.js
├── duda/
│   └── index.js
├── styles/
│   ├── theme.js
│   └── globalStyles.js
└── index.js
```

## Build and Deploy

### Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test
```

### Production
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## Integration Examples

### DUDA Integration
```javascript
let scriptSrc = 'https://your-cdn-url/icp-widget.js';
api.scripts.renderExternalApp(scriptSrc, element, {
    icpAccountName: data.config.icpAccountName,
    programId: data.config.programId,
    locationId: data.config.locationId
});
```

### Direct Script Tag
```html
<script 
    src="https://your-cdn-url/icp-widget.js"
    data-account-name="YOUR_ACCOUNT"
    data-program-id="YOUR_PROGRAM"
    data-location-id="YOUR_LOCATION"
    data-container-id="icp-widget-container">
</script>
```

## Testing Strategy

1. **Unit Tests**
   - Component rendering
   - API client methods
   - Utility functions

2. **Integration Tests**
   - API integration
   - DUDA integration
   - Error handling

3. **End-to-End Tests**
   - Full widget lifecycle
   - User interactions
   - Error scenarios

## Monitoring and Maintenance

1. **Error Tracking**
   - Console logging
   - Error boundaries
   - API error handling

2. **Performance Monitoring**
   - Bundle size tracking
   - Load time metrics
   - API response times

3. **Updates**
   - Dependency updates
   - Security patches
   - Feature additions 