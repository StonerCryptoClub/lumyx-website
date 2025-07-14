// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Contentful helpers
    try {
        window.config = {
            contentful: {
                spaceId: '74kxarv2y1kp',
                accessToken: 'your-access-token-here' // Replace with your actual access token
            }
        };

        if (!window.contentfulHelpers) {
            console.error('Contentful helpers not loaded');
            return;
        }

        window.contentfulHelpers.init(window.config.contentful);
        
        // Log initialization status
        console.log('Main.js: Contentful helpers initialization attempted');
        
    } catch (error) {
        console.error('Error initializing Contentful helpers:', error);
    }
}); 