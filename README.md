# IClassPro Widget v3.0.0

A lightweight, embeddable widget that displays IClassPro class schedules on any website. This widget uses IClassPro's API to fetch and display class information with real-time availability.

## Features

- Direct API integration with IClassPro
- Real-time class availability
- Clean, modern design
- Responsive layout
- Easy to embed
- No dependencies required
- Customizable appearance

## Quick Start

Add this script to your HTML where you want the widget to appear:

```html
<script 
    src="https://icp-widget.vercel.app/icp-widget.js"
    data-account-name="YOUR_ACCOUNT"
    data-param1="levels=YOUR_LEVEL"
    data-param2="programs=YOUR_PROGRAM"
    data-container-id="icp-widget-container">
</script>
```

### Required Parameters

- `data-account-name`: Your IClassPro account name
- `data-param1`: Level parameter (e.g., "levels=4")
- `data-param2`: Program parameter (e.g., "programs=56")
- `data-container-id`: (Optional) ID for the widget container

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/icp-widget.git
cd icp-widget
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000/example.html to test

## Deployment

The widget is designed to be deployed to Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Deploy

## Testing

Test the widget locally:
```bash
npm run dev
open http://localhost:3000/example.html
```

## Version History

### 3.0.0 - Stable API Integration
- Direct integration with IClassPro API
- Improved reliability and performance
- Real-time class availability
- Clean, modern UI

## License

ISC

## Support

For issues and feature requests, please open an issue on GitHub.