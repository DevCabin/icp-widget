# IClassPro Widget Walkthrough

This document explains how the IClassPro widget works. The widget is a React-based solution that displays class schedules directly from the IClassPro API, while maintaining the lightweight and efficient nature of the original implementation.

## Widget Structure

### 1. Widget Initialization and Config
The widget can be initialized in two ways:

#### DUDA Integration
```javascript
api.scripts.renderExternalApp(scriptSrc, element, {
    icpAccountName: data.config.icpAccountName,
    programId: data.config.programId,
    locationId: data.config.locationId
});
```

#### Direct Script Tag
```javascript
<script 
    src="https://your-cdn-url/icp-widget.js"
    data-account-name="YOUR_ACCOUNT"
    data-program-id="YOUR_PROGRAM"
    data-location-id="YOUR_LOCATION"
    data-container-id="icp-widget-container">
</script>
```

### 2. React Components
The widget is built using React components for better maintainability and reusability:

#### Main ClassList Component
```javascript
const ClassList = ({ icpAccountName, locationId, programId }) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // ... component logic
};
```

### 3. API Integration
Direct API communication is handled by the ICPClient class:
```javascript
class ICPClient {
    constructor(config) {
        this.accountName = config.accountName;
        this.locationId = config.locationId || '1';
        this.programId = config.programId;
        // ... configuration
    }

    async getClasses() {
        // ... API fetching logic with retry mechanism
    }
}
```

### 4. Styling
The widget uses styled-components for consistent and maintainable styling:
```javascript
const ClassCard = styled.div`
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
    // ... more styles
`;
```

### 5. Error Handling
Comprehensive error handling is implemented at multiple levels:
- API-level errors with retry logic
- React error boundary for component errors
- User-friendly error displays

### 6. Loading States
Loading states are managed through React state:
```javascript
if (loading) {
    return (
        <LoadingContainer>
            <div>Loading classes...</div>
        </LoadingContainer>
    );
}
```

## Key Features

1. **React-Based Architecture**: Modern component-based structure
2. **Direct API Integration**: Makes calls directly to the IClassPro API
3. **Styled Components**: Modular and maintainable CSS-in-JS
4. **Error Boundaries**: Comprehensive error handling
5. **Responsive Design**: Mobile-friendly layout
6. **DUDA Compatible**: Works seamlessly with DUDA's renderExternalApp
7. **Retry Logic**: Handles network issues gracefully
8. **Theme Support**: Consistent styling through theme provider

## Usage

### DUDA Integration
```javascript
let scriptSrc = 'https://your-cdn-url/icp-widget.js';
api.scripts.renderExternalApp(scriptSrc, element, {
    icpAccountName: "YOUR_ACCOUNT",
    programId: "YOUR_PROGRAM",
    locationId: "YOUR_LOCATION"
});
```

### Direct HTML Integration
```html
<script 
    src="https://your-cdn-url/icp-widget.js"
    data-account-name="YOUR_ACCOUNT"
    data-program-id="YOUR_PROGRAM"
    data-location-id="YOUR_LOCATION"
    data-container-id="icp-widget-container">
</script>
```

### Required Parameters
- `icpAccountName`/`data-account-name`: Your IClassPro account name
- `programId`/`data-program-id`: Program ID for filtering classes
- `locationId`/`data-location-id`: Location ID (defaults to '1')
- `data-container-id`: (Optional) ID for the widget container

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Testing
Run the test suite:
```bash
npm test
``` 