# IClassPro Widget

A lightweight, embeddable widget for displaying IClassPro classes on your website. This widget uses server-side rendering to properly handle Angular content and display your class listings anywhere.

## Features

- 🎨 Responsive grid layout
- 🚀 Server-side rendering of Angular content
- 🔄 Automatic content extraction
- ⚡ Loading states and error handling
- 🌐 CORS-friendly
- 📱 Mobile-friendly

## Quick Start

Add the widget script to your HTML with the required configuration attributes:

```html
<script 
  src="https://icp-widget-53os27sci-devcabins-projects.vercel.app/icp-widget.js"
  data-account-name="your-gym"
  data-param1="gender-filter"
  data-param2="program-filter"
  data-container-id="icp-widget-container">
</script>
```

### Configuration Options

Required parameters:
- `data-account-name`: Your IClassPro account name (e.g., "your-gym")
- `data-param1`: First filter parameter (typically gender filter)
- `data-param2`: Second filter parameter (typically program filter)

Optional parameters:
- `data-param3`: Additional filter parameter
- `data-param4`: Additional filter parameter
- `data-container-id`: Custom container ID (defaults to "icp-widget-container")

The widget will automatically create its container element where the script tag is placed.

## How It Works

1. The widget script is loaded on your page
2. It constructs the appropriate IClassPro portal URL with your parameters
3. Our serverless function uses Puppeteer to:
   - Load the portal URL
   - Wait for the Angular app to fully render
   - Extract the class card content
4. The widget displays the extracted content in a clean, responsive layout

## States & Feedback

The widget provides clear feedback about its current state:

- Loading: "Loading classes..."
- No Classes: "No classes available at the moment."
- Error: "Error loading classes. Please try again later."

## Technical Implementation

- Uses Vercel serverless functions for server-side rendering
- Implements Puppeteer for proper Angular content extraction
- Handles CORS and cross-origin concerns
- Provides fallbacks and error states
- Automatically retries on failure

## Development

1. Clone:
```bash
git clone https://github.com/DevCabin/icp-widget.git
```

2. Install:
```bash
npm install
```

3. Run locally:
```bash
vercel dev
```

4. Deploy:
```bash
vercel deploy
```

## Dependencies

- chrome-aws-lambda: ^10.1.0
- puppeteer-core: ^10.1.0
- vercel: ^32.0.0

## Browser Support

The widget is compatible with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- First load may take 2-3 seconds due to serverless cold start
- Subsequent loads are typically under 1 second
- Content is loaded asynchronously and doesn't block page rendering

## Support

Open an issue on GitHub for support.

## License

MIT