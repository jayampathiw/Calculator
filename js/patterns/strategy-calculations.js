/**
 * @fileoverview Strategy Pattern - Calculation Strategies
 * Different calculation strategies for basic and scientific operations
 */

// STRATEGY PATTERN - Calculation Strategies
const CalculationStrategies = {
    basic: {
        operations: {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => {
                if (b === 0) throw new Error('Division by zero');
                return a / b;
            },
            '%': (a, b) => a % b
        }
    },
    scientific: {
        operations: {
            sin: (x) => Math.sin(x * Math.PI / 180), // Convert to radians
            cos: (x) => Math.cos(x * Math.PI / 180),
            tan: (x) => Math.tan(x * Math.PI / 180),
            log: (x) => {
                if (x <= 0) throw new Error('Invalid logarithm input');
                return Math.log10(x);
            },
            ln: (x) => {
                if (x <= 0) throw new Error('Invalid natural logarithm input');
                return Math.log(x);
            },
            sqrt: (x) => {
                if (x < 0) throw new Error('Invalid square root input');
                return Math.sqrt(x);
            },
            power: (x) => Math.pow(x, 2),
            factorial: (x) => {
                if (x < 0 || !Number.isInteger(x) || x > 170) {
                    throw new Error('Invalid factorial input');
                }
                if (x === 0 || x === 1) return 1;
                let result = 1;
                for (let i = 2; i <= x; i++) {
                    result *= i;
                }
                return result;
            }
        }
    }
};

// Export for use in other modules
window.CalculationStrategies = CalculationStrategies;