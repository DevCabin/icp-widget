# IClassPro Widget

A lightweight widget for embedding IClassPro class schedules on any website.

## Current Version: 1.5.1

### Features
- Dynamic class schedule loading
- Customizable parameters
- Responsive design
- Loading animation
- Error handling
- Automatic height adjustment
- CORS support

### Next Steps
- [ ] Fix styling issues with card bodies
- [ ] Add support for custom themes
- [ ] Implement caching for better performance
- [ ] Add support for filtering options
- [ ] Improve error messages and user feedback

### Installation

Add the widget script to your HTML:

```html
<script 
    src="https://icp-widget.vercel.app/icp-widget.js"
    data-account-name="your-account-name"
    data-levels="4"
    data-programs="56"
    data-days="2"
    async
    crossorigin="anonymous">
</script>
```

### Required Parameters
- `data-account-name`: Your IClassPro account name

### Optional Parameters
- `data-levels`: Level filter (default: "4")
- `data-programs`: Program filter (default: "56")
- `data-days`: Days filter (default: "2")
- `data-container-id`: Custom ID for the widget container (default: "icp-widget")

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