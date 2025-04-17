(function() {
    const script = document.currentScript;
    const config = {
        accountName: script.getAttribute("data-account-name"),
        param1: script.getAttribute("data-param1"),
        param2: script.getAttribute("data-param2"),
        param3: script.getAttribute("data-param3"),
        param4: script.getAttribute("data-param4"),
        containerId: script.getAttribute("data-container-id") || "icp-widget-container"
    };

    if (!config.accountName) {
        console.error("IClassPro Widget: Missing required parameter. Please provide data-account-name.");
        return;
    }

    const widgetContainer = document.createElement("div");
    widgetContainer.id = config.containerId;
    widgetContainer.style.cssText = "font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Oxygen, Ubuntu, Cantarell, \"Open Sans\", \"Helvetica Neue\", sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;";

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

    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Loading classes...';
    loadingMessage.style.cssText = 'margin-top: 10px; color: #666;';
    
    loadingContainer.appendChild(loadingMessage);
    widgetContainer.appendChild(loadingContainer);
    
    script.parentNode.insertBefore(widgetContainer, script);

    async function loadClasses() {
        try {
            // Extract parameters
            const params = new URLSearchParams();
            
            // Parse param1 and param2 for levels and programs
            if (config.param1) {
                const [key, value] = config.param1.split('=');
                if (key === 'levels') params.append('levels', value);
            }
            if (config.param2) {
                const [key, value] = config.param2.split('=');
                if (key === 'programs') params.append('programs', value);
            }

            // Get the base URL for the proxy
            const baseUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000' 
                : 'https://icp-widget.vercel.app';

            console.log('Fetching classes...');
            
            // Make the request through our proxy
            const response = await fetch(`${baseUrl}/api/proxy?accountName=${config.accountName}&${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Received data:', data);
            
            if (data && data.classes && data.classes.length > 0) {
                const content = data.classes.map(cls => {
                    const schedule = cls.schedule[0];
                    const status = cls.openings > 0 
                        ? `<span style="color: #4CAF50;">Open (${cls.openings} spots)</span>` 
                        : (cls.allowWaitlist ? '<span style="color: #FFA726;">Waitlist Available</span>' : '<span style="color: #F44336;">Full</span>');
                    
                    const registerUrl = `https://portal.iclasspro.com/${config.accountName}/classes/${cls.id}`;
                    
                    return `
                        <div style="border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 15px; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <h3 style="margin: 0; color: #333; flex: 1;">${cls.name}</h3>
                                <div style="text-align: right;">
                                    ${status}
                                </div>
                            </div>
                            <div style="margin-top: 10px; color: #666;">
                                <strong>${schedule.dayName}</strong> ${schedule.startTime} - ${schedule.endTime}
                            </div>
                            <div style="margin-top: 10px;">
                                <a href="${registerUrl}" target="_blank" style="display: inline-block; padding: 8px 16px; background: #1b7ecf; color: white; text-decoration: none; border-radius: 4px; font-size: 14px;">
                                    View Class Details
                                </a>
                            </div>
                        </div>
                    `;
                }).join("");

                widgetContainer.innerHTML = `
                    <h2 style="text-align: center; margin-bottom: 20px; color: #333;">Available Classes</h2>
                    ${content}
                `;
            } else {
                widgetContainer.innerHTML = "<div style=\"text-align: center; padding: 20px; color: #666;\">No classes available at the moment.</div>";
            }
        } catch (error) {
            console.error("Error loading classes:", error);
            widgetContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #ff4444;">
                    <p>Error loading classes. Please try again later.</p>
                    <p style="font-size: 0.8em; color: #666; margin-top: 10px;">Error details: ${error.message}</p>
                </div>
            `;
        }
    }

    // Start loading after a short delay to ensure the widget is properly mounted
    setTimeout(loadClasses, 100);
})();
