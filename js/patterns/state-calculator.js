/**
 * @fileoverview State Pattern - Calculator States
 * Manages different calculator operational states
 */

// STATE PATTERN - Calculator States
class CalculatorState {
    constructor(context) {
        this.context = context;
    }

    handleInput(input) { throw new Error('handleInput must be implemented'); }
}

class IdleState extends CalculatorState {
    handleInput(input) {
        if (input.type === 'number') {
            this.context.setState(new InputtingState(this.context));
            return this.context.handleInput(input);
        }
        return this.context.getCurrentValue();
    }
}

class InputtingState extends CalculatorState {
    handleInput(input) {
        if (input.type === 'operator') {
            this.context.setState(new OperatorState(this.context));
            return this.context.handleInput(input);
        }
        // Continue inputting numbers
        return input.value;
    }
}

class OperatorState extends CalculatorState {
    handleInput(input) {
        if (input.type === 'number') {
            this.context.setState(new InputtingState(this.context));
            return this.context.handleInput(input);
        }
        return this.context.getCurrentValue();
    }
}

// Export for use in other modules
window.CalculatorState = CalculatorState;
window.IdleState = IdleState;
window.InputtingState = InputtingState;
window.OperatorState = OperatorState;