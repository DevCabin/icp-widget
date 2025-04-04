# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Switched from axios to Puppeteer for server-side rendering of IClassPro content
- Increased serverless function memory to 3008MB and duration to 30s
- Added Vercel-specific Chrome configuration for Puppeteer
- Increased timeouts for page loading and content extraction
- Improved error handling and logging
- Improved widget loading experience by starting API request immediately
- Removed countdown timer in favor of continuous loading animation
- Added performance timing logs for load time monitoring
- Current stable pre-work point for v1.5.2 (6-7s load time identified)

### Fixed
- Serverless function crashes by properly handling Angular app rendering
- Content extraction issues by waiting for dynamic content to load
- Memory and timeout issues in Vercel environment

## [1.5.3] - 2024-03-19
### Added
- Improved round progress circle styling (45px x 45px)
- Enhanced weekday list layout and spacing
- Added proper vertical alignment for all elements

### Changed
- Updated round progress container to float right
- Adjusted weekday list to 50% width with 150px minimum
- Improved spacing between elements
- Fixed layout issues with waitlist circle and weekday list

### Fixed
- Resolved overlapping issues between elements
- Fixed vertical alignment of text and elements
- Improved overall card layout structure

## [1.5.2] - 2024-03-19
### Added
- Preserved original Angular app class structure
- Added complete CSS styling from Angular app
- Added support for all card classes and layouts

### Changed
- Updated card extraction to capture full article structure
- Enhanced CSS to match Angular app styling
- Improved image handling with aspect ratio support
- Maintained original class names for better compatibility

### Fixed
- Fixed card structure preservation
- Resolved styling inconsistencies
- Fixed image aspect ratio handling

## [1.5.1] - 2024-03-19
### Added
- Switched from cheerio to Puppeteer for better handling of dynamic Angular content
- Added proper waiting for content to load with networkidle0
- Improved error handling and logging

### Changed
- Updated module system to use CommonJS consistently
- Enhanced URL parameter handling
- Improved browser configuration for Puppeteer

### Fixed
- Fixed issue with dynamic content not being captured
- Resolved module import/export inconsistencies
- Fixed timing issues with content loading

## [1.5.0] - 2024-03-19
### Added
- Switched from axios to cheerio for HTML parsing
- Added detailed error logging
- Enhanced error display in UI

### Changed
- Improved parameter handling
- Updated URL construction logic
- Enhanced error messages

### Fixed
- Fixed double-encoding issues in URL parameters
- Resolved CORS issues
- Fixed error handling in widget.js

## [1.4.0] - 2024-03-19
### Added
- Added support for generic parameter names (param1, param2, param3)
- Enhanced error handling and logging
- Added detailed request/response logging

### Changed
- Updated URL construction to handle generic parameters
- Improved error messages and display
- Enhanced parameter validation

### Fixed
- Fixed URL encoding issues
- Resolved parameter handling bugs
- Fixed error display formatting

## [1.3.0] - 2024-03-19
### Added
- Added support for multiple widget instances on the same page
- Added container ID customization
- Enhanced error handling

### Changed
- Updated widget initialization to handle multiple instances
- Improved error messages
- Enhanced styling for multiple widgets

### Fixed
- Fixed container ID conflicts
- Resolved styling issues with multiple widgets
- Fixed error display for multiple instances

## [1.2.0] - 2024-03-19
### Added
- Added loading animation with countdown timer
- Added support for custom container IDs
- Enhanced error handling

### Changed
- Updated widget initialization
- Improved error messages
- Enhanced styling

### Fixed
- Fixed container creation issues
- Resolved styling conflicts
- Fixed error display

## [1.1.0] - 2024-03-19
### Added
- Added support for custom container IDs
- Added error handling for missing parameters
- Enhanced error messages

### Changed
- Updated widget initialization
- Improved error handling
- Enhanced styling

### Fixed
- Fixed container creation issues
- Resolved styling conflicts
- Fixed error display

## [1.0.0] - 2024-03-19
### Added
- Initial release
- Basic widget functionality
- Support for IClassPro class schedules
- Loading animation
- Error handling
- Responsive design
- Height adjustment
- CORS support
- Parameter handling
- Documentation

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