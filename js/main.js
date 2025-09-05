/**
 * @fileoverview Main application entry point
 * Initializes the calculator application and handles service worker registration
 */

// Main application initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the calculator
        if (window.CalculatorController) {
            CalculatorController.init();
        } else {
            console.error('CalculatorController not available');
        }
    } catch (error) {
        console.error('Failed to initialize calculator:', error);
        
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-family: 'Segoe UI', sans-serif;
            z-index: 9999;
        `;
        errorDiv.textContent = 'Failed to initialize calculator. Please refresh the page.';
        document.body.appendChild(errorDiv);
    }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This would register a service worker if we had one
        // navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registration placeholder');
    });
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    if (window.Logger) {
        Logger.getInstance().log('error', 'Global error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (window.Logger) {
        Logger.getInstance().log('error', 'Unhandled promise rejection', event.reason);
    }
    
    // Prevent the default browser handling
    event.preventDefault();
});