# IClassPro Widget v2.0 - DUDA Integration

A modern, embeddable widget that displays IClassPro class schedules on DUDA websites. This widget fetches live class data from IClassPro's API and provides a seamless integration experience for DUDA users.

## 🚀 Live Demo

**API Endpoint**: `https://icp-widget.vercel.app/api/iclasspro?account={account}`

**DUDA Widget Files**:
- `duda.html` - DUDA widget template
- `duda.js` - DUDA widget JavaScript

## ✨ Features

- **Live Data Integration**: Fetches real-time class data from IClassPro API
- **DUDA Compatible**: Built specifically for DUDA website builder
- **Responsive Design**: Works on all device sizes
- **Performance Optimized**: Batch processing for large class lists
- **Analytics Ready**: Built-in tracking with Google Analytics support
- **Fallback System**: Demo data when API is unavailable
- **Customizable**: Toggle visibility of class details, pricing, instructors, etc.

## 🏗️ Architecture

### Current Implementation (V2)
```
icp-widget/
├── api/
│   ├── iclasspro.py          # Python proxy server (Vercel)
│   └── requirements.txt      # Python dependencies
├── duda.html                 # DUDA widget template
├── duda.js                   # DUDA widget JavaScript
└── V1/                       # Legacy V1 implementation
```

### API Proxy (Python)
The Python proxy (`api/iclasspro.py`) handles:
- CORS headers for cross-origin requests
- iClassPro API integration
- Data transformation and formatting
- Error handling and fallbacks
- HTML parsing for non-JSON responses

### DUDA Widget
The DUDA widget (`duda.html` + `duda.js`) provides:
- Real-time class data fetching
- Configurable display options
- Performance-optimized rendering
- Analytics tracking
- Responsive design

## 🔧 Setup Instructions

### For DUDA Users

1. **Deploy the Proxy** (if not already deployed):
   - The proxy is already deployed at: `https://icp-widget.vercel.app/api/iclasspro`
   - No additional setup required

2. **Add Widget to DUDA**:
   - Upload `duda.html` and `duda.js` to your DUDA site
   - Configure the widget with your iClassPro account name
   - Customize display options as needed

3. **Widget Configuration**:
   ```javascript
   // Available configuration options
   {
     accountName: 'your-account',        // Required: Your iClassPro account
     maxClasses: 10,                     // Max classes to display
     showHeader: true,                   // Show widget header
     headerTitle: 'Available Classes',   // Header title
     headerSubtitle: '',                 // Header subtitle
     showTime: true,                     // Show class times
     showInstructor: true,               // Show instructors
     showDescription: true,              // Show descriptions
     showPrice: true,                    // Show pricing
     showAgeGroup: true,                 // Show age groups
     showCapacity: true,                 // Show enrollment info
     showSchedule: true,                 // Show schedule details
     showEnrollButton: true,             // Show enroll buttons
     showFooter: true,                   // Show footer
     footerText: 'View All Classes'      // Footer text
   }
   ```

## 📡 API Usage

### Endpoint
```
GET https://icp-widget.vercel.app/api/iclasspro?account={account}&genders={genders}&programs={programs}
```

### Parameters
- `account` (required): Your iClassPro account name
- `genders` (optional): Gender/level filter (default: '2')
- `programs` (optional): Program filter (default: '56')

### Response Format
```json
{
  "classes": [
    {
      "id": "class_id",
      "name": "Class Name",
      "instructors": ["Instructor Name"],
      "schedule": [
        {
          "startTime": "10:00 AM",
          "endTime": "10:30 AM",
          "dayName": "Monday"
        }
      ],
      "description": "Class description",
      "openings": 2,
      "enrolled": 6,
      "price": "$65/month",
      "capacity": 8,
      "allowWaitlist": true
    }
  ],
  "total": 1,
  "totalRecords": 1,
  "source": "iclasspro_api_v1_method",
  "status": 200
}
```

## 🧪 Testing

### Test API Endpoint
```bash
# Test with a real account
curl "https://icp-widget.vercel.app/api/iclasspro?account=aerialsnorth"

# Test with demo account
curl "https://icp-widget.vercel.app/api/iclasspro?account=demo"
```

### Test DUDA Widget
1. Open `duda.html` in a browser
2. Modify the account name in the JavaScript
3. Verify class data loads correctly

## 🔄 Version History

### V2.0 (Current) - DUDA Integration
- ✅ Python proxy with live iClassPro API integration
- ✅ DUDA widget template and JavaScript
- ✅ Performance optimizations for large class lists
- ✅ Analytics tracking integration
- ✅ Responsive design
- ✅ Fallback system with demo data

### V1.0 (Legacy) - Node.js Implementation
- Node.js proxy server
- Basic widget functionality
- Limited customization options

## 🚀 Deployment

### Vercel Deployment
The project is automatically deployed to Vercel:
- **URL**: `https://icp-widget.vercel.app`
- **API**: `https://icp-widget.vercel.app/api/iclasspro`
- **Auto-deploy**: Pushes to main branch trigger deployment

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues

1. **No classes showing**:
   - Verify account name is correct
   - Check browser console for errors
   - Test API endpoint directly

2. **CORS errors**:
   - Ensure using the deployed proxy URL
   - Check that proxy is returning CORS headers

3. **Slow loading**:
   - Widget uses batch processing for large lists
   - Consider reducing `maxClasses` setting

### Debug Mode
Enable debug logging in the browser console:
```javascript
// The widget logs detailed information to console
// Check for messages starting with "ICP Widget:"
```

## 📊 Analytics

The widget includes built-in analytics tracking:
- `icp_classes_loaded` - When classes are displayed
- `icp_api_loaded` - When live data is fetched
- `icp_demo_loaded` - When demo data is used
- `icp_enroll_click` - When enroll button is clicked

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License

## 🆘 Support

For issues and feature requests:
- Open an issue on GitHub
- Check the troubleshooting section above
- Test the API endpoint directly

---

**Live API**: `https://icp-widget.vercel.app/api/iclasspro`  
**Status**: ✅ Active and deployed  
**Last Updated**: December 2024
