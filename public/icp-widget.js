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

    // Log the widget configuration
    console.log('Widget Configuration:', {
        containerId: config.containerId,
        accountName: config.accountName,
        param1: config.param1,
        param2: config.param2,
        param3: config.param3,
        param4: config.param4
    });

    // Create the widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = config.containerId;
    widgetContainer.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    `;

    // Add fun loading animation
    const loadingEmojis = ['🤸', '🎪', '🌟'];
    let currentEmojiIndex = 0;
    
    function updateLoadingAnimation() {
        const emojis = loadingEmojis.map((emoji, index) => 
            `<span style="
                font-size: 24px;
                opacity: ${index === currentEmojiIndex ? '1' : '0.3'};
                transition: opacity 0.3s ease;
                margin: 0 5px;
            ">${emoji}</span>`
        ).join('');

        widgetContainer.innerHTML = `
            <div style="
                text-align: center;
                padding: 40px 20px;
            ">
                <div style="
                    font-size: 18px;
                    color: #666;
                    margin-bottom: 20px;
                ">Loading your classes</div>
                <div>${emojis}</div>
            </div>
        `;

        currentEmojiIndex = (currentEmojiIndex + 1) % loadingEmojis.length;
    }

    // Start loading animation
    updateLoadingAnimation();
    const loadingInterval = setInterval(updateLoadingAnimation, 500);

    // Function to render the classes
    function renderClasses(classes) {
        // Clear loading animation
        clearInterval(loadingInterval);

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
            widgetContainer.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                    font-size: 18px;
                ">
                    No classes available at the moment 🤔
                </div>
            `;
        }
    }

    // Function to load classes
    async function loadClasses() {
        try {
            const params = new URLSearchParams({
                accountName: config.accountName,
                param1: config.param1,
                param2: config.param2
            });
            if (config.param3) params.append('param3', config.param3);
            if (config.param4) params.append('param4', config.param4);

            // Log the query parameters
            console.log('Widget Query Parameters:', {
                accountName: config.accountName,
                param1: config.param1,
                param2: config.param2,
                param3: config.param3,
                param4: config.param4,
                fullUrl: `https://icp-widget.vercel.app/api/proxy?${params}`
            });

            // Initial delay to let Angular load (extended to 4 seconds)
            console.log('Starting 4-second delay for Angular to load...');
            const delayStart = Date.now();
            await new Promise(resolve => setTimeout(resolve, 4000));
            const delayEnd = Date.now();
            console.log(`Delay completed. Duration: ${(delayEnd - delayStart) / 1000} seconds`);

            const response = await fetch(`https://icp-widget.vercel.app/api/proxy?${params}`);
            console.log('Widget Response Status:', response.status);
            
            const data = await response.json();
            console.log('Widget Response Data:', data);
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            renderClasses(data.classes);
        } catch (error) {
            clearInterval(loadingInterval);
            console.error('Widget Error:', error);
            widgetContainer.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 40px 20px;
                    color: #ff4444;
                    font-size: 18px;
                ">
                    Error loading classes 😢<br>
                    <span style="font-size: 14px; color: #666; margin-top: 10px; display: block;">
                        Please try again later
                    </span>
                </div>
            `;
        }
    }

    // Add the container to the page
    script.parentNode.insertBefore(widgetContainer, script);

    // Load classes when the widget is initialized
    loadClasses();
})();
