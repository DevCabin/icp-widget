# IClassPro Widget

A lightweight widget for embedding IClassPro class schedules on any website.

## Features

- Responsive design that works on all screen sizes
- Real-time class schedule display
- Customizable appearance
- No dependencies on external libraries
- Server-side rendering for better performance

## Installation

1. Add the widget script to your HTML:
```html
<script src="https://icp-widget.vercel.app/icp-widget.js"></script>
```

2. Add the widget container where you want it to appear:
```html
<div id="icp-widget"></div>
```

3. Initialize the widget with your IClassPro account details:
```html
<script>
  window.ICPWidget.init({
    accountName: 'your-account-name',
    param1: 'genders=2',
    param2: 'programs=56'
  });
</script>
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/DevCabin/icp-widget.git
cd icp-widget
```

2. Install dependencies:
```bash
npm install
```

3. Run locally:
```bash
npm run dev
```

## Deployment

The widget is deployed on Vercel. To deploy your own instance:

1. Fork this repository
2. Connect your fork to Vercel
3. Deploy using the Vercel dashboard or CLI:
```bash
npm run deploy
```

## Configuration

The widget accepts the following configuration options:

- `accountName`: Your IClassPro account name (required)
- `param1`: First URL parameter (optional)
- `param2`: Second URL parameter (optional)

## License

ISC