// Environment Variable Loader for Client-Side
// This loads environment variables safely for production use

class EnvLoader {
    constructor() {
        this.config = {};
        this.loadEnvironmentVariables();
    }

    loadEnvironmentVariables() {
        // In production, these should be set via build process or server-side injection
        // For development, we'll use a fallback method
        
        if (typeof process !== 'undefined' && process.env) {
            // Node.js environment (build time)
            this.config = {
                supabase: {
                    url: process.env.SUPABASE_URL,
                    anonKey: process.env.SUPABASE_ANON_KEY
                },
                contentful: {
                    spaceId: process.env.CONTENTFUL_SPACE_ID,
                    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
                },
                emailjs: {
                    publicKey: process.env.EMAILJS_PUBLIC_KEY,
                    serviceId: process.env.EMAILJS_SERVICE_ID,
                    clientTemplateId: process.env.EMAILJS_CLIENT_TEMPLATE_ID,
                    teamTemplateId: process.env.EMAILJS_TEAM_TEMPLATE_ID
                }
            };
        } else {
            // Browser environment - use injected variables
            this.config = window.ENV_CONFIG || this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        // Fallback configuration for development
        // In production, this should be replaced with proper env var injection
        return {
            supabase: {
                url: 'SUPABASE_URL_PLACEHOLDER',
                anonKey: 'SUPABASE_ANON_KEY_PLACEHOLDER'
            },
            contentful: {
                spaceId: 'CONTENTFUL_SPACE_ID_PLACEHOLDER',
                accessToken: 'CONTENTFUL_ACCESS_TOKEN_PLACEHOLDER'
            },
            emailjs: {
                publicKey: 'EMAILJS_PUBLIC_KEY_PLACEHOLDER',
                serviceId: 'EMAILJS_SERVICE_ID_PLACEHOLDER',
                clientTemplateId: 'EMAILJS_CLIENT_TEMPLATE_ID_PLACEHOLDER',
                teamTemplateId: 'EMAILJS_TEAM_TEMPLATE_ID_PLACEHOLDER'
            }
        };
    }

    getConfig() {
        return this.config;
    }

    isConfigured() {
        return this.config.supabase.url && 
               this.config.supabase.url !== 'SUPABASE_URL_PLACEHOLDER' &&
               this.config.contentful.spaceId && 
               this.config.contentful.spaceId !== 'CONTENTFUL_SPACE_ID_PLACEHOLDER';
    }
}

// Initialize environment loader
window.envLoader = new EnvLoader();
window.config = window.envLoader.getConfig();

// Prevent modification of configuration
Object.freeze(window.config);

// Encryption functions for data security (keeping existing functionality)
window.encryptData = function(data, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

window.decryptData = function(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}; 