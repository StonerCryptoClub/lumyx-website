// Environment configuration loader
class EnvironmentLoader {
    constructor() {
        this.config = null;
        this.isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    }

    // Load configuration from environment variables or fallback to defaults
    loadConfig() {
        // Try to load from injected ENV_CONFIG first
        if (window.ENV_CONFIG) {
            this.config = {
                contentful: {
                    spaceId: window.ENV_CONFIG.CONTENTFUL_SPACE_ID,
                    accessToken: window.ENV_CONFIG.CONTENTFUL_ACCESS_TOKEN
                },
                emailjs: {
                    publicKey: window.ENV_CONFIG.EMAILJS_PUBLIC_KEY,
                    serviceId: window.ENV_CONFIG.EMAILJS_SERVICE_ID,
                    clientTemplateId: window.ENV_CONFIG.EMAILJS_CLIENT_TEMPLATE_ID,
                    teamTemplateId: window.ENV_CONFIG.EMAILJS_TEAM_TEMPLATE_ID
                }
            };
        } else {
            // Fallback to hardcoded values for development
            console.warn('ENV_CONFIG not found, using fallback configuration');
            this.config = {
                contentful: {
                    spaceId: '74kxarv2y1kp',
                    accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
                },
                emailjs: {
                    publicKey: 'kroz7yxsw1nMzB7br',
                    serviceId: 'service_qe8dgoh',
                    clientTemplateId: 'template_jrwx295',
                    teamTemplateId: 'template_t5xs49r'
                }
            };
        }

        // Make config globally available
        window.config = this.config;
        Object.freeze(window.config);
        
        return this.config;
    }

    // Check if configuration is valid
    isConfigValid() {
        return this.config.contentful.spaceId &&
               this.config.contentful.spaceId !== 'CONTENTFUL_SPACE_ID_PLACEHOLDER' &&
               this.config.contentful.accessToken &&
               this.config.contentful.accessToken !== 'CONTENTFUL_ACCESS_TOKEN_PLACEHOLDER';
    }

    // Get configuration
    getConfig() {
        if (!this.config) {
            this.loadConfig();
        }
        return this.config;
    }
}

// Initialize environment loader
const envLoader = new EnvironmentLoader();
envLoader.loadConfig();

// Export for use in other scripts
window.envLoader = envLoader;

// Encryption functions for data security (keeping existing functionality)
window.encryptData = function(data, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

window.decryptData = function(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}; 