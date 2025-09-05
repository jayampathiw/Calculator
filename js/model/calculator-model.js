/**
 * @fileoverview Calculator Model - MVC Pattern
 * Handles calculator state, business logic, and data persistence
 */

// ENHANCED CALCULATOR MODEL with multiple patterns
const CalculatorModel = (() => {
    // Private state
    let currentValue = '0';
    let previousValue = '';
    let operator = null;
    let isWaitingForOperand = false;
    let history = '';
    let memoryValue = 0;
    let calculationHistory = [];
    let currentStrategy = 'basic';
    let currentState = null;
    
    const eventEmitter = new EventEmitter();
    const commandHistory = new CommandHistory();
    const storage = new StorageRepository();
    const logger = Logger.getInstance();

    // Load saved data on initialization
    const savedData = storage.load();
    if (savedData) {
        memoryValue = savedData.memoryValue || 0;
        calculationHistory = savedData.calculationHistory || [];
    }

    // Private methods
    const saveState = () => {
        storage.save({
            memoryValue,
            calculationHistory
        });
    };

    const formatNumber = (number) => {
        if (isNaN(number) || !isFinite(number)) {
            throw new Error('Invalid number');
        }
        
        const numStr = number.toString();
        if (numStr.length > 12) {
            return Number(number).toExponential(5);
        }
        
        // Format large numbers with commas
        if (Math.abs(number) >= 1000 && numStr.indexOf('.') === -1) {
            return number.toLocaleString();
        }
        
        return numStr;
    };

    const addToHistory = (expression, result) => {
        const historyItem = {
            id: Date.now(),
            expression,
            result,
            timestamp: new Date().toISOString()
        };
        
        calculationHistory.unshift(historyItem);
        
        // Limit history size
        if (calculationHistory.length > 100) {
            calculationHistory = calculationHistory.slice(0, 100);
        }
        
        saveState();
        eventEmitter.emit('historyUpdated', calculationHistory);
    };

    // Public interface
    return {
        // Event system
        on: (event, callback) => eventEmitter.on(event, callback),
        off: (event, callback) => eventEmitter.off(event, callback),

        // State management
        getState: () => ({
            currentValue,
            previousValue,
            operator,
            isWaitingForOperand,
            history,
            memoryValue
        }),

        setState: (state) => {
            currentValue = state.currentValue;
            previousValue = state.previousValue;
            operator = state.operator;
            isWaitingForOperand = state.isWaitingForOperand;
            history = state.history;
            memoryValue = state.memoryValue;
            eventEmitter.emit('stateChanged', state);
        },

        // Getters
        getCurrentValue: () => currentValue,
        getPreviousValue: () => previousValue,
        getOperator: () => operator,
        getHistory: () => history,
        getMemoryValue: () => memoryValue,
        getCalculationHistory: () => [...calculationHistory],
        isWaitingForOperand: () => isWaitingForOperand,

        // Setters with validation
        setCurrentValue: (value) => {
            if (typeof value !== 'string') {
                throw new Error('Current value must be a string');
            }
            currentValue = value;
            eventEmitter.emit('valueChanged', value);
        },

        setPreviousValue: (value) => { previousValue = value; },
        setOperator: (op) => { operator = op; },
        setHistory: (hist) => { history = hist; },
        setWaitingForOperand: (waiting) => { isWaitingForOperand = waiting; },

        // Strategy pattern implementation
        setStrategy: (strategy) => {
            if (!CalculationStrategies[strategy]) {
                throw new Error(`Unknown strategy: ${strategy}`);
            }
            currentStrategy = strategy;
            logger.log('info', `Strategy changed to: ${strategy}`);
        },

        // Enhanced calculation with error handling
        calculate: (op, a, b) => {
            try {
                const strategy = CalculationStrategies[currentStrategy];
                if (!strategy.operations[op]) {
                    throw new Error(`Unknown operation: ${op}`);
                }
                
                const result = strategy.operations[op](a, b);
                logger.log('info', `Calculation: ${a} ${op} ${b} = ${result}`);
                return result;
            } catch (error) {
                logger.log('error', 'Calculation error', error);
                throw error;
            }
        },

        // Scientific calculations
        scientificCalculate: (func, value) => {
            try {
                const strategy = CalculationStrategies.scientific;
                if (!strategy.operations[func]) {
                    throw new Error(`Unknown function: ${func}`);
                }
                
                const result = strategy.operations[func](value);
                logger.log('info', `Scientific calculation: ${func}(${value}) = ${result}`);
                return result;
            } catch (error) {
                logger.log('error', 'Scientific calculation error', error);
                throw error;
            }
        },

        // Memory operations
        memoryStore: (value) => {
            memoryValue = parseFloat(value) || 0;
            saveState();
            eventEmitter.emit('memoryChanged', memoryValue);
            logger.log('info', `Memory stored: ${memoryValue}`);
        },

        memoryRecall: () => {
            logger.log('info', `Memory recalled: ${memoryValue}`);
            return memoryValue.toString();
        },

        memoryAdd: (value) => {
            memoryValue += parseFloat(value) || 0;
            saveState();
            eventEmitter.emit('memoryChanged', memoryValue);
            logger.log('info', `Memory add: ${value}, new value: ${memoryValue}`);
        },

        memorySubtract: (value) => {
            memoryValue -= parseFloat(value) || 0;
            saveState();
            eventEmitter.emit('memoryChanged', memoryValue);
            logger.log('info', `Memory subtract: ${value}, new value: ${memoryValue}`);
        },

        memoryClear: () => {
            memoryValue = 0;
            saveState();
            eventEmitter.emit('memoryChanged', memoryValue);
            logger.log('info', 'Memory cleared');
        },

        // History management
        addCalculationToHistory: (expression, result) => {
            addToHistory(expression, result);
        },

        clearHistory: () => {
            calculationHistory = [];
            saveState();
            eventEmitter.emit('historyUpdated', calculationHistory);
            logger.log('info', 'History cleared');
        },

        // Command pattern for undo/redo
        getCommandHistory: () => commandHistory,

        // Validation
        validateInput: (input) => {
            if (typeof input !== 'string') return false;
            return /^[0-9+\-*/.%()=]$/.test(input);
        },

        // Reset with event emission
        reset: () => {
            const oldState = {
                currentValue,
                previousValue,
                operator,
                isWaitingForOperand,
                history
            };
            
            currentValue = '0';
            previousValue = '';
            operator = null;
            isWaitingForOperand = false;
            history = '';
            
            eventEmitter.emit('reset', oldState);
            logger.log('info', 'Calculator reset');
        },

        // Format number with error handling
        formatNumber: formatNumber,

        // Get constants
        getConstants: () => ({
            pi: Math.PI,
            e: Math.E
        })
    };
})();

// Export for use in other modules
window.CalculatorModel = CalculatorModel;