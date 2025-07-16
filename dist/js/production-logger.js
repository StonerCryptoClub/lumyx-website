// Production Logger
// Replaces console.log with safe logging for production environment

class ProductionLogger {
    constructor() {
        this.isProduction = this.detectEnvironment();
        this.logs = [];
        this.maxLogs = 100; // Keep only last 100 logs
        
        // Override console methods in production
        if (this.isProduction) {
            this.overrideConsole();
        }
    }
    
    detectEnvironment() {
        // Check various indicators of production environment
        return (
            window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1' &&
            !window.location.hostname.includes('local') &&
            !window.location.search.includes('debug=true')
        );
    }
    
    overrideConsole() {
        // Store original console methods
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug
        };
        
        // Override console methods
        console.log = (...args) => this.log('log', ...args);
        console.info = (...args) => this.log('info', ...args);
        console.debug = (...args) => this.log('debug', ...args);
        
        // Keep warnings and errors but sanitize them
        console.warn = (...args) => this.log('warn', ...args);
        console.error = (...args) => this.log('error', ...args);
    }
    
    log(level, ...args) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message: args.join(' '),
            url: window.location.href
        };
        
        // Store log entry (limited to prevent memory issues)
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // In production, only show errors and warnings
        if (this.isProduction) {
            if (level === 'error' || level === 'warn') {
                this.originalConsole[level](`[${timestamp}] ${level.toUpperCase()}:`, ...args);
            }
            // Silent for log, info, debug in production
        } else {
            // In development, show all logs
            this.originalConsole[level](`[${timestamp}] ${level.toUpperCase()}:`, ...args);
        }
    }
    
    // Safe logging methods that respect production environment
    safeLog(message, data = null) {
        if (!this.isProduction) {
            console.log(message, data);
        }
    }
    
    safeWarn(message, data = null) {
        console.warn(message, data);
    }
    
    safeError(message, error = null) {
        console.error(message, error);
    }
    
    // Get logs for debugging (admin only)
    getLogs() {
        return this.logs;
    }
    
    // Clear logs
    clearLogs() {
        this.logs = [];
    }
    
    // Send critical errors to logging service (if implemented)
    reportError(error, context = '') {
        const errorReport = {
            timestamp: new Date().toISOString(),
            error: error.message || error,
            stack: error.stack,
            context,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // Store locally for now (could be sent to logging service)
        this.logs.push({
            ...errorReport,
            level: 'error'
        });
        
        // Show in console for debugging
        this.safeError('Error reported:', errorReport);
    }
}

// Initialize production logger
window.productionLogger = new ProductionLogger();

// Provide convenient global functions
window.safeLog = function(message, data) {
    return window.productionLogger.safeLog(message, data);
};

window.safeWarn = function(message, data) {
    return window.productionLogger.safeWarn(message, data);
};

window.safeError = function(message, error) {
    return window.productionLogger.safeError(message, error);
};

window.reportError = function(error, context) {
    return window.productionLogger.reportError(error, context);
};

// Override global error handler
window.addEventListener('error', function(event) {
    window.productionLogger.reportError(event.error, 'Global error handler');
});

// Override unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    window.productionLogger.reportError(event.reason, 'Unhandled promise rejection');
});

// Initialize message
if (window.productionLogger.isProduction) {
    console.log('Production Logger initialized - Debug output suppressed');
} else {
    console.log('Production Logger initialized - Development mode active');
} 