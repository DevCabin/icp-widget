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

    // Create icons container
    const iconsContainer = document.createElement('div');
    iconsContainer.style.cssText = `
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
    `;

    // Create three icons
    const icons = ['⚡', '🎯', '✨'].map(icon => {
        const iconElement = document.createElement('div');
        iconElement.textContent = icon;
        iconElement.style.cssText = `
            font-size: 24px;
            opacity: 0.3;
            transition: opacity 0.3s ease;
        `;
        iconsContainer.appendChild(iconElement);
        return iconElement;
    });

    // Create countdown timer
    const timerElement = document.createElement('div');
    timerElement.style.cssText = `
        font-family: monospace;
        font-size: 18px;
        color: #666;
        margin-top: 10px;
    `;

    loadingContainer.appendChild(iconsContainer);
    loadingContainer.appendChild(timerElement);
    widgetContainer.appendChild(loadingContainer);

    // Start the loading animation
    let currentIconIndex = 0;
    let startTime = Date.now();
    const duration = 4000; // 4 seconds

    const updateTimer = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const seconds = Math.floor(remaining / 1000);
        const milliseconds = Math.floor((remaining % 1000));
        timerElement.textContent = `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
    };

    const animateIcons = () => {
        icons.forEach((icon, index) => {
            icon.style.opacity = index === currentIconIndex ? '1' : '0.3';
        });
        currentIconIndex = (currentIconIndex + 1) % icons.length;
    };

    // Initial icon animation
    animateIcons();

    // Start the countdown timer
    const timerInterval = setInterval(updateTimer, 10);
    const iconInterval = setInterval(animateIcons, 1000);

    // Wait for the delay
    setTimeout(() => {
        clearInterval(timerInterval);
        clearInterval(iconInterval);
        console.log('Delay completed. Duration:', (Date.now() - startTime) / 1000, 'seconds');

        // Function to load content
        async function loadContent() {
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
                    fullUrl: `https://icp-widget.vercel.app/api/render?${params}`
                });

                // Create and configure iframe
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '600px'; // Initial height
                iframe.style.border = 'none';
                iframe.style.background = '#ffffff';
                iframe.style.borderRadius = '8px';
                iframe.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                
                // Log the full URL we're about to request
                const fullUrl = `https://icp-widget.vercel.app/api/render?${params}`;
                console.log('Widget Request URL:', fullUrl);
                console.log('Widget Request Parameters:', Object.fromEntries(new URLSearchParams(params)));
                
                iframe.src = fullUrl;

                // Listen for height updates from iframe
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'iframeHeight') {
                        iframe.style.height = event.data.height + 'px';
                    }
                });

                // Replace loading animation with iframe
                widgetContainer.innerHTML = '';
                widgetContainer.appendChild(iframe);

            } catch (error) {
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

        // Load content when the widget is initialized
        loadContent();
    }, duration);

    // Add the container to the page
    script.parentNode.insertBefore(widgetContainer, script);
})();
