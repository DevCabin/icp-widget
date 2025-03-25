# IClassPro Widget

A lightweight, responsive widget for embedding IClassPro class schedules on any website.

## Features

- 🎯 Easy to embed with a single line of code
- 📱 Fully responsive design
- ⚡ Serverless architecture
- 🔄 Real-time content updates
- 🎨 Customizable styling
- 🔒 Secure content delivery
- ⏱️ Smart loading states
- 📊 Automatic height adjustment

## Installation

Add this script to your website:

```html
<script src="https://icp-widget.vercel.app/icp-widget.js"></script>
```

Then initialize the widget:

```html
<script>
    ICPWidget.init({
        accountName: 'your-account-name',
        param1: 'genders=2',
        param2: 'programs=56',
        param3: 'levels=4',
        param4: 'days=6'
    });
</script>
```

## Configuration

The widget accepts the following parameters:

- `accountName` (required): Your IClassPro account name
- `param1` through `param4` (optional): URL parameters for filtering classes

## Technical Details

### Serverless Architecture

The widget uses Vercel's serverless functions with the following configuration:
- Memory: 3008MB
- Duration: 30 seconds
- Runtime: Node.js

### Content Rendering

The widget uses Puppeteer for server-side rendering of the IClassPro Angular application, ensuring:
- Proper execution of JavaScript
- Dynamic content loading
- Accurate content extraction
- Reliable error handling

### Security

- CORS enabled for cross-origin requests
- Content Security Policy (CSP) compliant
- HTTPS-only communication
- Input validation and sanitization

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel CLI (optional)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/icp-widget.git
   cd icp-widget
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment

The widget is automatically deployed to Vercel when changes are pushed to the main branch.

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository.