# Changelog

All notable changes to the IClassPro Widget project will be documented in this file.

## [2.1.1] - 2024-03-26
### Pre-build Restore Point
- Established restore point before React modernization
- Completed implementation planning
- Created detailed documentation structure
- Set up build system configuration
- Prepared component architecture

### Added
- IMPLEMENTATION.MD with detailed modernization plan
- React-based component structure
- Build system configuration with webpack
- New API client architecture
- Comprehensive error handling system

### Changed
- Updated WALKTHROUGH.MD for React implementation
- Restructured project for component-based architecture
- Modified configuration handling for DUDA integration
- Enhanced styling system with styled-components

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