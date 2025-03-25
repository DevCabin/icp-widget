(function() {
    // Create the widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'icp-widget-container';
    widgetContainer.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    `;

    // Add loading state
    widgetContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading classes...</div>';
    document.currentScript.parentNode.insertBefore(widgetContainer, document.currentScript);

    // Function to fetch and display classes
    async function loadClasses() {
        try {
            const response = await fetch('https://icp-widget-my2b29fg3-devcabins-projects.vercel.app/api/proxy');
            const data = await response.json();
            
            if (data && data.classes) {
                const classesHtml = data.classes.map(cls => `
                    <div style="
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 15px;
                        background: white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    ">
                        <h3 style="margin: 0 0 10px 0; color: #333;">${cls.name}</h3>
                        <p style="margin: 0; color: #666;">${cls.description || 'No description available'}</p>
                        <div style="margin-top: 10px; color: #888; font-size: 0.9em;">
                            <span>${cls.capacity} spots</span> • 
                            <span>${cls.duration} minutes</span>
                        </div>
                    </div>
                `).join('');

                widgetContainer.innerHTML = `
                    <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Available Classes</h2>
                    ${classesHtml}
                `;
            } else {
                widgetContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No classes available at the moment.</div>';
            }
        } catch (error) {
            console.error('Error loading classes:', error);
            widgetContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff4444;">Error loading classes. Please try again later.</div>';
        }
    }

    // Load classes when the widget is initialized
    loadClasses();
})();
