(function() {
    const script = document.currentScript;
    const config = {
        containerId: script.getAttribute("data-container-id") || "icp-widget-container",
        accountName: script.getAttribute("data-account-name"),
        param1: script.getAttribute("data-param1"),
        param2: script.getAttribute("data-param2"),
        param3: script.getAttribute("data-param3"),
        param4: script.getAttribute("data-param4")
    };

    // Validate required parameters
    if (!config.accountName || !config.param1 || !config.param2) {
        console.error("IClassPro Widget: Missing required parameters. Please provide data-account-name, data-param1, and data-param2.");
        return;
    }

    // Construct the portal URL with parameters
    let portalUrl = `https://portal.iclasspro.com/${config.accountName}/classes?genders=${config.param1}&programs=${config.param2}`;
    if (config.param3) portalUrl += `&${config.param3}`;
    if (config.param4) portalUrl += `&${config.param4}`;

    // Create the widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = config.containerId;
    widgetContainer.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    `;

    // Add loading state
    widgetContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading classes...</div>';
    script.parentNode.insertBefore(widgetContainer, script);

    // Function to render the classes in our widget
    function renderClasses(classes) {
        if (classes && classes.length > 0) {
            const classesHtml = classes.map(cls => `
                <div style="
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background: white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                ">
                    ${cls.html}
                </div>
            `).join('');

            widgetContainer.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Available Classes</h2>
                ${classesHtml}
            `;
        } else {
            widgetContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No classes available at the moment.</div>';
        }
    }

    // Function to load classes via proxy
    async function loadClasses() {
        try {
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(portalUrl)}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            renderClasses(data.classes);
        } catch (error) {
            console.error('Error loading classes:', error);
            widgetContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff4444;">Error loading classes. Please try again later.</div>';
        }
    }

    // Load classes when the widget is initialized
    loadClasses();
})();
