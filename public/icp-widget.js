(function() {
    const script = document.currentScript;
    const config = {
        containerId: script.getAttribute("data-container-id") || "icp-widget-container",
        accountName: script.getAttribute("data-account-name"),
        param1: script.getAttribute("data-param1"),
        param2: script.getAttribute("data-param2")
    };

    // Create the widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = config.containerId;
    widgetContainer.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    `;

    // Create loading animation
    const loadingContainer = document.createElement('div');
    loadingContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;

    const loadingText = document.createElement('div');
    loadingText.textContent = 'Loading classes...';
    loadingText.style.cssText = `
        color: #666;
        margin-top: 10px;
    `;
    
    loadingContainer.appendChild(loadingText);
    widgetContainer.appendChild(loadingContainer);

    // Function to load content
    async function loadContent() {
        try {
            // Build query parameters
            const queryParts = ['locationId=1', 'limit=50', 'page=1'];
            
            // Parse param1 and param2 for levels and programs
            if (config.param1) {
                const [key, value] = config.param1.split('=');
                if (key === 'levels') queryParts.push(`levels=${value}`);
            }
            if (config.param2) {
                const [key, value] = config.param2.split('=');
                if (key === 'programs') queryParts.push(`programs=${value}`);
            }

            // Make the API request directly to IClassPro
            const url = `https://app.iclasspro.com/api/open/v1/${config.accountName}/classes?${queryParts.join('&')}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'Accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Referer': 'https://portal.iclasspro.com/',
                    'Origin': 'https://portal.iclasspro.com'
                }
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.data || !data.data.length) {
                widgetContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #666; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        No classes available at this time.
                    </div>
                `;
                return;
            }

            // Create the classes display
            const content = data.data.map(classItem => {
                const schedule = classItem.schedule[0] || {};
                const status = classItem.openings > 0 
                    ? `<span style="color: #4CAF50;">Open (${classItem.openings} spots)</span>` 
                    : (classItem.allowWaitlist ? '<span style="color: #FFA726;">Waitlist Available</span>' : '<span style="color: #F44336;">Full</span>');
                
                return `
                    <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <h3 style="margin: 0; color: #333; flex: 1;">${classItem.name}</h3>
                            <div style="text-align: right;">
                                ${status}
                            </div>
                        </div>
                        <div style="margin-top: 10px; color: #666;">
                            <strong>${schedule.dayName || 'TBD'}</strong> ${schedule.startTime || ''} - ${schedule.endTime || ''}
                        </div>
                        <div style="margin-top: 10px;">
                            <a href="https://portal.iclasspro.com/${config.accountName}/classes/${classItem.id}" 
                               target="_blank" 
                               style="display: inline-block; padding: 8px 16px; background: #1b7ecf; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">
                                View Class Details
                            </a>
                        </div>
                    </div>
                `;
            }).join('');

            widgetContainer.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Available Classes</h2>
                ${content}
            `;

        } catch (error) {
            console.error('Widget Error:', error);
            widgetContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #dc3545; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="font-size: 18px; margin-bottom: 10px;">Unable to load classes</div>
                    <div style="font-size: 14px; color: #666;">Please try again later</div>
                </div>
            `;
        }
    }

    // Add the container to the page and start loading
    script.parentNode.insertBefore(widgetContainer, script);
    loadContent();
})();
