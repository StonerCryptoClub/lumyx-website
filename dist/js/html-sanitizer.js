// HTML Sanitization Utility
// Prevents XSS attacks by sanitizing user input and dynamic content

class HTMLSanitizer {
    constructor() {
        // Define allowed HTML tags and attributes
        this.allowedTags = {
            'p': ['class', 'id'],
            'div': ['class', 'id'],
            'span': ['class', 'id'],
            'h1': ['class', 'id'],
            'h2': ['class', 'id'],
            'h3': ['class', 'id'],
            'h4': ['class', 'id'],
            'h5': ['class', 'id'],
            'h6': ['class', 'id'],
            'strong': ['class'],
            'em': ['class'],
            'b': ['class'],
            'i': ['class'],
            'u': ['class'],
            'br': [],
            'hr': [],
            'ul': ['class'],
            'ol': ['class'],
            'li': ['class'],
            'a': ['href', 'target', 'rel', 'class'],
            'img': ['src', 'alt', 'class', 'width', 'height'],
            'blockquote': ['class'],
            'code': ['class'],
            'pre': ['class']
        };
        
        // Define dangerous attributes that should never be allowed
        this.dangerousAttributes = [
            'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onchange', 'onsubmit', 'onreset',
            'onselect', 'onkeydown', 'onkeypress', 'onkeyup',
            'javascript:', 'vbscript:', 'data:', 'about:'
        ];
        
        // Define dangerous protocols
        this.dangerousProtocols = [
            'javascript:', 'vbscript:', 'data:', 'about:'
        ];
    }
    
    // Main sanitization method
    sanitize(html) {
        if (!html || typeof html !== 'string') {
            return '';
        }
        
        // Remove script tags and their content
        html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        // Remove style tags and their content
        html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        
        // Remove dangerous attributes
        this.dangerousAttributes.forEach(attr => {
            const regex = new RegExp(`\\s*${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
            html = html.replace(regex, '');
        });
        
        // Remove dangerous protocols
        this.dangerousProtocols.forEach(protocol => {
            const regex = new RegExp(`\\s*href\\s*=\\s*["']\\s*${protocol}[^"']*["']`, 'gi');
            html = html.replace(regex, '');
        });
        
        // Parse and filter HTML
        return this.filterHTML(html);
    }
    
    // Filter HTML tags and attributes
    filterHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        
        return this.processNode(div).innerHTML;
    }
    
    // Process individual nodes
    processNode(node) {
        const allowedNode = document.createElement('div');
        
        Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                // Text nodes are safe
                allowedNode.appendChild(child.cloneNode(true));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();
                
                if (this.allowedTags[tagName]) {
                    const newElement = document.createElement(tagName);
                    
                    // Copy allowed attributes
                    this.allowedTags[tagName].forEach(attr => {
                        const attrValue = child.getAttribute(attr);
                        if (attrValue && this.isAttributeValueSafe(attr, attrValue)) {
                            newElement.setAttribute(attr, attrValue);
                        }
                    });
                    
                    // Recursively process children
                    const processedChild = this.processNode(child);
                    newElement.innerHTML = processedChild.innerHTML;
                    
                    allowedNode.appendChild(newElement);
                } else {
                    // For disallowed tags, process their children
                    const processedChild = this.processNode(child);
                    allowedNode.innerHTML += processedChild.innerHTML;
                }
            }
        });
        
        return allowedNode;
    }
    
    // Check if attribute value is safe
    isAttributeValueSafe(attr, value) {
        // Check for dangerous protocols in href attributes
        if (attr === 'href') {
            const lowerValue = value.toLowerCase().trim();
            return !this.dangerousProtocols.some(protocol => lowerValue.startsWith(protocol));
        }
        
        // Check for dangerous patterns in all attributes
        const dangerousPatterns = [
            /javascript:/i,
            /vbscript:/i,
            /data:/i,
            /about:/i,
            /on\w+\s*=/i
        ];
        
        return !dangerousPatterns.some(pattern => pattern.test(value));
    }
    
    // Sanitize text content (for use in textContent)
    sanitizeText(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        // Escape HTML entities
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Safe method to set innerHTML
    safeSetInnerHTML(element, html) {
        if (!element || !html) {
            return;
        }
        
        element.innerHTML = this.sanitize(html);
    }
    
    // Safe method to append HTML
    safeAppendHTML(element, html) {
        if (!element || !html) {
            return;
        }
        
        const sanitizedHTML = this.sanitize(html);
        element.innerHTML += sanitizedHTML;
    }
}

// Create global instance
window.htmlSanitizer = new HTMLSanitizer();

// Provide convenient global functions
window.sanitizeHTML = function(html) {
    return window.htmlSanitizer.sanitize(html);
};

window.sanitizeText = function(text) {
    return window.htmlSanitizer.sanitizeText(text);
};

window.safeSetInnerHTML = function(element, html) {
    return window.htmlSanitizer.safeSetInnerHTML(element, html);
};

window.safeAppendHTML = function(element, html) {
    return window.htmlSanitizer.safeAppendHTML(element, html);
};

console.log('HTML Sanitizer initialized - XSS protection enabled'); 