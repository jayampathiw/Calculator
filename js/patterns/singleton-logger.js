/**
 * @fileoverview Singleton Pattern - Logger Service
 * Centralized logging system for the calculator application
 */

// SINGLETON PATTERN - Logger Service
const Logger = (() => {
    let instance;
    
    function createInstance() {
        const logs = [];
        
        return {
            log: (level, message, data = null) => {
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    level,
                    message,
                    data
                };
                logs.push(logEntry);
                console.log(`[${level.toUpperCase()}] ${message}`, data || '');
            },
            getLogs: () => [...logs],
            clearLogs: () => logs.length = 0
        };
    }
    
    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Export for use in other modules
window.Logger = Logger;