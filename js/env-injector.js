// Environment Variable Injector for Build Process
const fs = require('fs');
const path = require('path');

function loadEnvFile(envPath = '.env') {
    const envConfig = {};
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=');
                envConfig[key.trim()] = value.trim();
            }
        });
    }
    
    return envConfig;
}

function injectEnvVariables(htmlContent, envConfig) {
    const envScript = `
    <script>
        // Injected environment variables
        window.ENV_CONFIG = {
            supabase: {
                url: '${envConfig.SUPABASE_URL || ''}',
                anonKey: '${envConfig.SUPABASE_ANON_KEY || ''}'
            },
            contentful: {
                spaceId: '${envConfig.CONTENTFUL_SPACE_ID || ''}',
                accessToken: '${envConfig.CONTENTFUL_ACCESS_TOKEN || ''}'
            },
            emailjs: {
                publicKey: '${envConfig.EMAILJS_PUBLIC_KEY || ''}',
                serviceId: '${envConfig.EMAILJS_SERVICE_ID || ''}',
                clientTemplateId: '${envConfig.EMAILJS_CLIENT_TEMPLATE_ID || ''}',
                teamTemplateId: '${envConfig.EMAILJS_TEAM_TEMPLATE_ID || ''}'
            }
        };
    </script>`;
    
    // Inject before the closing head tag
    return htmlContent.replace('</head>', `${envScript}\n</head>`);
}

module.exports = {
    loadEnvFile,
    injectEnvVariables
}; 