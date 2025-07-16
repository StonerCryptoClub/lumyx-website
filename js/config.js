// Configuration - DEPRECATED
// This file is kept for backward compatibility only
// API keys have been moved to environment variables for security
window.config = {
    supabase: {
        url: 'MOVED_TO_ENV_VARS',
        anonKey: 'MOVED_TO_ENV_VARS'
    },
    emailjs: {
        publicKey: 'MOVED_TO_ENV_VARS',
        serviceId: 'MOVED_TO_ENV_VARS',
        clientTemplateId: 'MOVED_TO_ENV_VARS',
        teamTemplateId: 'MOVED_TO_ENV_VARS'
    },
    contentful: {
        spaceId: 'MOVED_TO_ENV_VARS',
        accessToken: 'MOVED_TO_ENV_VARS'
    }
};

// Prevent modification of configuration
Object.freeze(window.config);

// Encryption functions for data security
window.encryptData = function(data, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

window.decryptData = function(encryptedData, key) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Generate a unique encryption key for the session
window.encryptionKey = CryptoJS.lib.WordArray.random(32).toString(); 