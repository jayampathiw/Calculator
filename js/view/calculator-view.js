/**
 * @fileoverview Calculator View - MVC Pattern
 * Handles DOM manipulation, UI updates, and user interface
 */

// ENHANCED VIEW with additional UI patterns
const CalculatorView = (() => {
    const elements = {
        display: document.getElementById('display'),
        current: document.getElementById('current'),
        history: document.getElementById('history'),
        memoryIndicator: document.getElementById('memoryIndicator'),
        keypad: document.getElementById('keypad'),
        scientificFunctions: document.getElementById('scientificFunctions'),
        historyPanel: document.getElementById('historyPanel'),
        toast: document.getElementById('toast'),
        modeToggles: document.querySelectorAll('.mode-toggle'),
        themeToggles: document.querySelectorAll('.theme-toggle')
    };

    let currentTheme = 'light';
    let showingHistory = false;

    // Private methods
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const showToast = (message, type = 'success') => {
        elements.toast.textContent = message;
        elements.toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    };

    const updateHistoryPanel = (historyItems) => {
        elements.historyPanel.innerHTML = '';
        
        if (historyItems.length === 0) {
            elements.historyPanel.innerHTML = '<div class="history-item">No calculations yet</div>';
            return;
        }

        historyItems.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            historyElement.innerHTML = `
                <div>${item.expression} = ${item.result}</div>
                <div style="font-size: 0.75rem; opacity: 0.7;">
                    ${new Date(item.timestamp).toLocaleTimeString()}
                </div>
            `;
            historyElement.addEventListener('click', () => {
                if (window.CalculatorController) {
                    window.CalculatorController.loadFromHistory(item.result);
                }
            });
            elements.historyPanel.appendChild(historyElement);
        });
    };

    // Public interface
    return {
        // Display updates with animations
        updateDisplay: debounce((current, history = '') => {
            if (elements.current) elements.current.textContent = current;
            if (elements.history) elements.history.textContent = history;
        }, 16), // 60fps

        updateMemoryIndicator: (hasMemory) => {
            if (elements.memoryIndicator) {
                elements.memoryIndicator.textContent = hasMemory ? 'M' : '';
            }
        },

        showError: (message = 'Error') => {
            if (elements.display) {
                elements.display.classList.add('error-state');
            }
            if (elements.current) {
                elements.current.textContent = message;
            }
            showToast(message, 'error');
        },

        clearError: () => {
            if (elements.display) {
                elements.display.classList.remove('error-state');
            }
        },

        showLoading: (button) => {
            button.classList.add('loading');
            button.disabled = true;
        },

        hideLoading: (button) => {
            button.classList.remove('loading');
            button.disabled = false;
        },

        toggleScientificMode: (isScientific) => {
            if (elements.scientificFunctions) {
                elements.scientificFunctions.classList.toggle('active', isScientific);
            }
            if (elements.keypad) {
                elements.keypad.classList.toggle('keypad--scientific', isScientific);
            }
        },

        toggleHistoryPanel: () => {
            showingHistory = !showingHistory;
            if (elements.historyPanel) {
                elements.historyPanel.classList.toggle('active', showingHistory);
            }
            return showingHistory;
        },

        updateHistoryPanel: updateHistoryPanel,

        toggleTheme: () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', currentTheme);
            return currentTheme;
        },

        updateModeToggles: (activeMode) => {
            elements.modeToggles.forEach(toggle => {
                toggle.classList.toggle('active', toggle.dataset.mode === activeMode);
            });
        },

        showToast: showToast,

        // Enhanced button state management
        setButtonState: (selector, state) => {
            const button = document.querySelector(selector);
            if (button) {
                button.disabled = state === 'disabled';
                button.classList.toggle('active', state === 'active');
            }
        },

        // Animation helpers
        animateButton: (button) => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 100);
        },

        // Accessibility helpers
        announceToScreenReader: (message) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.style.position = 'absolute';
            announcement.style.left = '-10000px';
            announcement.textContent = message;
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        },

        // Event binding with delegation
        bindEvents: (controller) => {
            // Enhanced event delegation
            document.addEventListener('click', (e) => {
                if (e.target.closest('.keypad')) {
                    controller.handleKeypadClick(e);
                } else if (e.target.closest('.scientific-functions')) {
                    controller.handleScientificClick(e);
                } else if (e.target.closest('.memory-functions')) {
                    controller.handleMemoryClick(e);
                } else if (e.target.dataset.mode) {
                    controller.handleModeToggle(e);
                } else if (e.target.dataset.theme) {
                    controller.handleThemeToggle(e);
                } else if (e.target.dataset.action === 'history') {
                    controller.handleHistoryToggle(e);
                }
            });

            // Enhanced keyboard support
            document.addEventListener('keydown', controller.handleKeyboard);
            
            // Touch events for mobile
            document.addEventListener('touchstart', (e) => {
                if (e.target.classList.contains('btn')) {
                    this.animateButton(e.target);
                }
            });
        }
    };
})();

// Export for use in other modules
window.CalculatorView = CalculatorView;