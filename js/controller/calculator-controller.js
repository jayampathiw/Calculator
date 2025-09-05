/**
 * @fileoverview Calculator Controller - MVC Pattern
 * Handles user interactions and coordinates between Model and View
 */

// ENHANCED CONTROLLER with advanced patterns
const CalculatorController = (() => {
    let currentMode = 'basic';
    
    // Initialize model event listeners
    const initializeModelListeners = () => {
        if (!window.CalculatorModel || !window.CalculatorView) {
            console.error('CalculatorModel or CalculatorView not available');
            return;
        }

        CalculatorModel.on('valueChanged', (value) => {
            CalculatorView.updateDisplay(value, CalculatorModel.getHistory());
        });

        CalculatorModel.on('memoryChanged', (memoryValue) => {
            CalculatorView.updateMemoryIndicator(memoryValue !== 0);
        });

        CalculatorModel.on('historyUpdated', (history) => {
            CalculatorView.updateHistoryPanel(history);
        });

        CalculatorModel.on('reset', () => {
            updateView();
            CalculatorView.showToast('Calculator reset');
        });
    };

    // Private methods
    const updateView = () => {
        CalculatorView.updateDisplay(
            CalculatorModel.getCurrentValue(),
            CalculatorModel.getHistory()
        );
        CalculatorView.updateMemoryIndicator(CalculatorModel.getMemoryValue() !== 0);
    };

    const formatNumber = (number) => {
        try {
            return CalculatorModel.formatNumber(number);
        } catch (error) {
            CalculatorView.showError('Invalid number');
            return '0';
        }
    };

    const inputNumber = (num) => {
        try {
            CalculatorView.clearError();
            
            if (CalculatorModel.isWaitingForOperand()) {
                CalculatorModel.setCurrentValue(num);
                CalculatorModel.setWaitingForOperand(false);
            } else {
                const current = CalculatorModel.getCurrentValue();
                const newValue = current === '0' ? num : current + num;
                
                // Limit input length
                if (newValue.length > 15) {
                    CalculatorView.showToast('Maximum digits reached', 'error');
                    return;
                }
                
                CalculatorModel.setCurrentValue(newValue);
            }
            updateView();
        } catch (error) {
            CalculatorView.showError('Input error');
        }
    };

    const inputOperator = (nextOperator) => {
        try {
            const current = parseFloat(CalculatorModel.getCurrentValue());
            const previous = CalculatorModel.getPreviousValue();
            const operator = CalculatorModel.getOperator();

            if (isNaN(current)) {
                CalculatorView.showError('Invalid input');
                return;
            }

            if (previous === '') {
                CalculatorModel.setPreviousValue(current.toString());
            } else if (operator && !CalculatorModel.isWaitingForOperand()) {
                const result = CalculatorModel.calculate(operator, parseFloat(previous), current);
                const formatted = formatNumber(result);
                CalculatorModel.setCurrentValue(formatted);
                CalculatorModel.setPreviousValue(result.toString());
            }

            CalculatorModel.setWaitingForOperand(true);
            CalculatorModel.setOperator(nextOperator);
            
            const history = `${CalculatorModel.getPreviousValue()} ${nextOperator}`;
            CalculatorModel.setHistory(history);
            updateView();
        } catch (error) {
            CalculatorView.showError(error.message);
        }
    };

    const calculate = () => {
        try {
            const current = parseFloat(CalculatorModel.getCurrentValue());
            const previous = CalculatorModel.getPreviousValue();
            const operator = CalculatorModel.getOperator();

            if (previous === '' || operator === null || isNaN(current)) {
                return;
            }

            const result = CalculatorModel.calculate(operator, parseFloat(previous), current);
            const formatted = formatNumber(result);
            const expression = `${previous} ${operator} ${current}`;
            
            // Add to history
            CalculatorModel.addCalculationToHistory(expression, formatted);
            
            CalculatorModel.setCurrentValue(formatted);
            CalculatorModel.setPreviousValue('');
            CalculatorModel.setOperator(null);
            CalculatorModel.setWaitingForOperand(true);
            CalculatorModel.setHistory(`${expression} =`);
            
            updateView();
            CalculatorView.announceToScreenReader(`Result: ${formatted}`);
        } catch (error) {
            CalculatorView.showError(error.message);
        }
    };

    // Public interface
    return {
        handleKeypadClick: (e) => {
            const target = e.target;
            CalculatorView.animateButton(target);
            
            if (target.dataset.number) {
                inputNumber(target.dataset.number);
            } else if (target.dataset.operator) {
                inputOperator(target.dataset.operator);
            } else if (target.dataset.action) {
                switch (target.dataset.action) {
                    case 'clear':
                        CalculatorModel.reset();
                        break;
                    case 'delete':
                        this.deleteLast();
                        break;
                    case 'decimal':
                        this.inputDecimal();
                        break;
                    case 'equals':
                        calculate();
                        break;
                    case 'undo':
                        this.undo();
                        break;
                }
            }
        },

        handleScientificClick: (e) => {
            const target = e.target;
            if (target.dataset.function) {
                this.performScientificFunction(target.dataset.function);
            }
        },

        handleMemoryClick: (e) => {
            const target = e.target;
            const action = target.dataset.memory;
            const current = CalculatorModel.getCurrentValue();
            
            CalculatorView.animateButton(target);
            
            switch (action) {
                case 'clear':
                    CalculatorModel.memoryClear();
                    CalculatorView.showToast('Memory cleared');
                    break;
                case 'recall':
                    const recalled = CalculatorModel.memoryRecall();
                    CalculatorModel.setCurrentValue(recalled);
                    CalculatorModel.setWaitingForOperand(true);
                    updateView();
                    CalculatorView.showToast('Memory recalled');
                    break;
                case 'add':
                    CalculatorModel.memoryAdd(current);
                    CalculatorView.showToast('Added to memory');
                    break;
                case 'subtract':
                    CalculatorModel.memorySubtract(current);
                    CalculatorView.showToast('Subtracted from memory');
                    break;
            }
        },

        handleModeToggle: (e) => {
            const mode = e.target.dataset.mode;
            const isScientific = mode === 'scientific';
            
            currentMode = mode;
            CalculatorModel.setStrategy(isScientific ? 'scientific' : 'basic');
            CalculatorView.toggleScientificMode(isScientific);
            CalculatorView.updateModeToggles(mode);
            CalculatorView.showToast(`${mode} mode activated`);
        },

        handleThemeToggle: (e) => {
            const newTheme = CalculatorView.toggleTheme();
            CalculatorView.showToast(`${newTheme} theme activated`);
        },

        handleHistoryToggle: (e) => {
            const isShowing = CalculatorView.toggleHistoryPanel();
            CalculatorView.updateHistoryPanel(CalculatorModel.getCalculationHistory());
            CalculatorView.showToast(isShowing ? 'History shown' : 'History hidden');
        },

        handleKeyboard: (e) => {
            // Prevent default for calculator keys
            if (/[0-9+\-*/.=]/.test(e.key) || ['Enter', 'Escape', 'Backspace'].includes(e.key)) {
                e.preventDefault();
            }
            
            if (e.key >= '0' && e.key <= '9') {
                inputNumber(e.key);
            } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
                inputOperator(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                calculate();
            } else if (e.key === 'Escape') {
                CalculatorModel.reset();
            } else if (e.key === 'Backspace') {
                this.deleteLast();
            } else if (e.key === '.') {
                this.inputDecimal();
            } else if (e.ctrlKey && e.key === 'z') {
                this.undo();
            }
        },

        deleteLast: () => {
            try {
                const current = CalculatorModel.getCurrentValue();
                if (current.length > 1 && current !== '0') {
                    CalculatorModel.setCurrentValue(current.slice(0, -1));
                } else {
                    CalculatorModel.setCurrentValue('0');
                }
                updateView();
            } catch (error) {
                CalculatorView.showError('Delete error');
            }
        },

        inputDecimal: () => {
            try {
                if (CalculatorModel.isWaitingForOperand()) {
                    CalculatorModel.setCurrentValue('0.');
                    CalculatorModel.setWaitingForOperand(false);
                } else if (CalculatorModel.getCurrentValue().indexOf('.') === -1) {
                    CalculatorModel.setCurrentValue(CalculatorModel.getCurrentValue() + '.');
                }
                updateView();
            } catch (error) {
                CalculatorView.showError('Decimal error');
            }
        },

        performScientificFunction: (func) => {
            try {
                CalculatorView.clearError();
                let result;
                
                if (func === 'pi' || func === 'e') {
                    const constants = CalculatorModel.getConstants();
                    result = constants[func];
                } else {
                    const current = parseFloat(CalculatorModel.getCurrentValue());
                    if (isNaN(current)) {
                        CalculatorView.showError('Invalid input for function');
                        return;
                    }
                    result = CalculatorModel.scientificCalculate(func, current);
                }
                
                const formatted = formatNumber(result);
                CalculatorModel.setCurrentValue(formatted);
                CalculatorModel.setWaitingForOperand(true);
                
                // Add to history
                const expression = func === 'pi' || func === 'e' ? func : `${func}(${CalculatorModel.getCurrentValue()})`;
                CalculatorModel.addCalculationToHistory(expression, formatted);
                
                updateView();
                CalculatorView.announceToScreenReader(`${func} result: ${formatted}`);
            } catch (error) {
                CalculatorView.showError(error.message);
            }
        },

        undo: () => {
            const commandHistory = CalculatorModel.getCommandHistory();
            if (commandHistory.undo()) {
                updateView();
                CalculatorView.showToast('Undone');
            } else {
                CalculatorView.showToast('Nothing to undo', 'error');
            }
        },

        loadFromHistory: (value) => {
            CalculatorModel.setCurrentValue(value.toString());
            CalculatorModel.setWaitingForOperand(true);
            updateView();
            CalculatorView.showToast('Loaded from history');
        },

        init: () => {
            try {
                initializeModelListeners();
                CalculatorView.bindEvents(this);
                updateView();
                CalculatorView.updateHistoryPanel(CalculatorModel.getCalculationHistory());
                
                // Initialize with saved memory state
                CalculatorView.updateMemoryIndicator(CalculatorModel.getMemoryValue() !== 0);
                
                if (window.Logger) {
                    Logger.getInstance().log('info', 'Calculator initialized successfully');
                }
            } catch (error) {
                if (window.Logger) {
                    Logger.getInstance().log('error', 'Calculator initialization failed', error);
                }
                CalculatorView.showError('Initialization failed');
            }
        }
    };
})();

// Export for use in other modules
window.CalculatorController = CalculatorController;