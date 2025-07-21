// Environment Variable Injector for Build Process
// This script injects environment variables into the built HTML files

class EnvInjector {
    constructor(envConfig) {
        this.envConfig = envConfig;
    }

    // Generate the environment configuration script
    generateEnvScript() {
        const configScript = `
<script>
// Environment Configuration
window.ENV_CONFIG = {
    CONTENTFUL_SPACE_ID: '${this.envConfig.CONTENTFUL_SPACE_ID || ''}',
    CONTENTFUL_ACCESS_TOKEN: '${this.envConfig.CONTENTFUL_ACCESS_TOKEN || ''}',
    EMAILJS_PUBLIC_KEY: '${this.envConfig.EMAILJS_PUBLIC_KEY || ''}',
    EMAILJS_SERVICE_ID: '${this.envConfig.EMAILJS_SERVICE_ID || ''}',
    EMAILJS_CLIENT_TEMPLATE_ID: '${this.envConfig.EMAILJS_CLIENT_TEMPLATE_ID || ''}',
    EMAILJS_TEAM_TEMPLATE_ID: '${this.envConfig.EMAILJS_TEAM_TEMPLATE_ID || ''}'
};

// Configuration object for backward compatibility
window.config = {
    contentful: {
        spaceId: '${this.envConfig.CONTENTFUL_SPACE_ID || ''}',
        accessToken: '${this.envConfig.CONTENTFUL_ACCESS_TOKEN || ''}'
    },
    emailjs: {
        publicKey: '${this.envConfig.EMAILJS_PUBLIC_KEY || ''}',
        serviceId: '${this.envConfig.EMAILJS_SERVICE_ID || ''}',
        clientTemplateId: '${this.envConfig.EMAILJS_CLIENT_TEMPLATE_ID || ''}',
        teamTemplateId: '${this.envConfig.EMAILJS_TEAM_TEMPLATE_ID || ''}'
    }
};

// Prevent modification of configuration
Object.freeze(window.ENV_CONFIG);
Object.freeze(window.config);
</script>`;
        return configScript;
    }

    // Inject environment variables into HTML content
    injectIntoHtml(htmlContent) {
        const envScript = this.generateEnvScript();
        
        // Look for the env-loader.js script tag and inject before it
        const envLoaderPattern = /<script src="js\/env-loader\.js"><\/script>/;
        
        if (envLoaderPattern.test(htmlContent)) {
            return htmlContent.replace(envLoaderPattern, envScript + '\n  <script src="js/env-loader.js"></script>');
        }
        
        // Fallback: inject in head section
        const headPattern = /<\/head>/;
        if (headPattern.test(htmlContent)) {
            return htmlContent.replace(headPattern, envScript + '\n</head>');
        }
        
        console.warn('Could not find injection point for environment variables');
        return htmlContent;
    }
}

// Export for use in build scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvInjector;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.EnvInjector = EnvInjector;
} 