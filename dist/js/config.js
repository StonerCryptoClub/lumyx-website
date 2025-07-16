// Configuration
window.config = {
    supabase: {
        url: 'https://ctvmeaezvszekbljtuwe.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dm1lYWV6dnN6ZWtibGp0dXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5Njc5OTksImV4cCI6MjA1NzU0Mzk5OX0.U7TZoaC_lKRvrRCKpSJTHNlB8uFFuHgA4MwuhXWp1E8'
    },
    emailjs: {
        publicKey: 'kroz7yxsw1nMzB7br',
        serviceId: 'service_qe8dgoh',
        clientTemplateId: 'template_jrwx295',
        teamTemplateId: 'template_t5xs49r'
    },
    contentful: {
        spaceId: '74kxarv2y1kp',
        accessToken: 'yJszWN6sgnfaKhUmjvl02S-T1UTq9TVBKLUH5xb5H8c'
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