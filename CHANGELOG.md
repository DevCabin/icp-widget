# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Switched from axios to Puppeteer for server-side rendering of IClassPro content
- Increased serverless function memory to 3008MB and duration to 30s
- Added Vercel-specific Chrome configuration for Puppeteer
- Increased timeouts for page loading and content extraction
- Improved error handling and logging

### Fixed
- Serverless function crashes by properly handling Angular app rendering
- Content extraction issues by waiting for dynamic content to load
- Memory and timeout issues in Vercel environment

## [0.1.0] - 2024-03-19

### Added
- Initial release
- Basic widget functionality
- Serverless API endpoint
- Loading animation
- Error handling
- Responsive design

## [1.0.0] - 2024-03-25

### Changed
- Switched from Puppeteer to axios + cheerio for simpler and more reliable server-side rendering
- Removed complex browser dependencies in favor of lightweight HTML parsing
- Improved error handling and response formatting
- Added detailed logging throughout the rendering process

### Fixed
- Resolved dependency conflicts with Puppeteer and Chrome packages
- Improved CORS handling and response headers
- Enhanced error messages and user feedback

### Added
- Support for direct HTML parsing and extraction
- Clean HTML response with proper styling
- Automatic iframe height adjustment
- Detailed request and response logging
- Basic widget implementation with server-side rendering
- Simple client-side display
- Basic error handling
- CORS support

### Technical Details

#### Server-Side (proxy.js)
- Uses Puppeteer to render Angular page
- Extracts class card HTML
- Basic error handling
- CORS headers

#### Client-Side (widget.js)
- Simple script tag implementation
- Basic parameter handling
- Clean display of classes
- Basic error states

### Usage Example
```html
<script 
  src="https://icp-widget-53os27sci-devcabins-projects.vercel.app/icp-widget.js"
  data-account-name="gymagination"
  data-param1="genders=2"
  data-param2="programs=56"
  async
  crossorigin="anonymous">
</script>
``` 