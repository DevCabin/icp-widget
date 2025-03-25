# IClassPro Widget

A lightweight, embeddable widget for displaying IClassPro classes on your website.

## Features

- 🎨 Responsive grid layout
- 🔄 Automatic retry mechanism
- 🌐 CORS-friendly proxy
- ⚡ Loading animation
- �� Error handling
- 📱 Mobile-friendly

## Quick Start

1. Add the widget script:
```html
<script src="https://icp-widget-53os27sci-devcabins-projects.vercel.app/icp-widget.js"></script>
```

2. Add the container:
```html
<div id="icp-widget"></div>
```

3. Configure:
```html
<script>
  window.ICP_CONFIG = {
    url: "https://your-gym.iclasspro.com",
    filters: {
      programs: ["Gymnastics"],
      levels: ["Beginner"]
    }
  };
</script>
```

## Development

1. Clone:
```bash
git clone https://github.com/DevCabin/icp-widget.git
```

2. Install:
```bash
npm install
```

3. Run:
```bash
vercel dev
```

## Support

Open an issue on GitHub for support.

## License

MIT