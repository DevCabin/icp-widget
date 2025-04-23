import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import ClassList from './components/ClassList';

// Theme configuration
const theme = {
    colors: {
        primary: '#1b7ecf',
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#F44336',
        text: '#333',
        textLight: '#666',
        border: '#eee',
        background: '#f5f5f5',
    },
    shadows: {
        small: '0 2px 4px rgba(0,0,0,0.1)',
        medium: '0 4px 8px rgba(0,0,0,0.1)',
    },
    borderRadius: '8px',
    transitions: {
        default: '0.2s ease',
    }
};

// Global error boundary
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Widget Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#dc3545',
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div>Something went wrong</div>
                    <div style={{ fontSize: '14px', marginTop: '10px' }}>
                        Please try refreshing the page
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Widget initialization function
const initWidget = (element, config) => {
    const root = createRoot(element);
    
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <ThemeProvider theme={theme}>
                    <ClassList
                        icpAccountName={config.icpAccountName}
                        locationId={config.locationId}
                        programId={config.programId}
                    />
                </ThemeProvider>
            </ErrorBoundary>
        </React.StrictMode>
    );
};

// Export for DUDA integration
window.ICPWidget = {
    init: function(scriptSrc, element, config) {
        initWidget(element, config);
    }
};

// Handle direct script tag embedding
if (typeof window !== 'undefined') {
    const script = document.currentScript;
    if (script) {
        const config = {
            icpAccountName: script.getAttribute('data-account-name'),
            locationId: script.getAttribute('data-location-id') || '1',
            programId: script.getAttribute('data-program-id')
        };

        const container = document.createElement('div');
        container.id = script.getAttribute('data-container-id') || 'icp-widget-container';
        script.parentNode.insertBefore(container, script);

        initWidget(container, config);
    }
} 