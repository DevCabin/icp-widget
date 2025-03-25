# IClassPro Widget

A lightweight widget for embedding IClassPro class schedules on any website. This widget fetches and displays class information from IClassPro's portal, with support for filtering and custom styling.

## Features

- Server-side rendering for better performance
- Support for filtering by gender, program, and other parameters
- Responsive design that works on all devices
- Automatic height adjustment
- Clean, modern styling
- CORS-enabled for cross-origin embedding

## Installation

1. Add the widget script to your HTML:
```html
<script 
    src="https://icp-widget.vercel.app/icp-widget.js"
    data-account-name="your-account-name"
    data-param1="genders=2"
    data-param2="programs=56"
    data-container-id="icp-widget-container">
</script>
```

2. Add a container element where you want the widget to appear:
```html
<div id="icp-widget-container"></div>
```

## Configuration

The widget accepts the following data attributes:

- `data-account-name`: Your IClassPro account name (required)
- `data-param1`: First filter parameter (e.g., "genders=2")
- `data-param2`: Second filter parameter (e.g., "programs=56")
- `data-param3`: Third filter parameter
- `data-param4`: Fourth filter parameter
- `data-container-id`: ID of the container element (defaults to "icp-widget-container")

## Development

This project is built with:
- Vercel for serverless deployment
- Axios for HTTP requests
- Cheerio for HTML parsing
- Vanilla JavaScript for client-side functionality

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Deploy to Vercel:
```bash
npm run deploy
```

## License

ISC

## Support

For issues and feature requests, please open an issue on GitHub.