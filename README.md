# IClassPro Widget

A lightweight widget for embedding IClassPro class schedules on any website.

## Current Version: 1.3.0

### Features
- Dynamic class schedule loading
- Customizable parameters
- Responsive design
- Enhanced loading animation with 5 rotating icons
- Error handling
- Automatic height adjustment
- CORS support
- Performance timing logs
- Hidden "View Available Dates" links

### Installation

Add the following script tag to your HTML:

```html
<script 
  src="https://icp-widget.vercel.app/icp-widget.js" 
  data-account-name="your-account-name"
  data-container-id="icp-widget-container"
></script>
```

### Parameters

- `data-account-name` (required): Your IClassPro account name
- `data-container-id` (optional): Custom ID for the widget container (default: "icp-widget-container")
- `data-param1` (optional): Additional parameter in format "key=value"
- `data-param2` (optional): Additional parameter in format "key=value"
- `data-param3` (optional): Additional parameter in format "key=value"

### Next Steps
- [ ] Fix styling issues with card bodies
- [ ] Add support for custom themes
- [ ] Implement caching for better performance
- [ ] Add support for filtering options

### Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `vercel dev`
4. Open `http://localhost:3000` in your browser

### Local Testing

For local development, use the local path:
```html
<script src="/icp-widget.js" ...></script>
```

For production, use the Vercel URL:
```html
<script src="https://icp-widget.vercel.app/icp-widget.js" ...></script>
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### License

ISC