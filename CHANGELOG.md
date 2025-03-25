# Changelog

All notable changes to the IClassPro Widget project will be documented in this file.

## [1.0.0] - 2024-03-25

### Added
- Basic widget implementation with server-side rendering
- Simple client-side display
- Puppeteer-based content extraction
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