/**
 * @fileoverview Command Pattern - For Undo/Redo functionality
 * Implements command pattern for reversible operations
 */

// COMMAND PATTERN - For Undo/Redo functionality
class Command {
    execute() { throw new Error('Execute method must be implemented'); }
    undo() { throw new Error('Undo method must be implemented'); }
}

class CalculationCommand extends Command {
    constructor(calculator, operation, operand) {
        super();
        this.calculator = calculator;
        this.operation = operation;
        this.operand = operand;
        this.previousState = null;
    }

    execute() {
        this.previousState = this.calculator.getState();
        return this.calculator.performOperation(this.operation, this.operand);
    }

    undo() {
        if (this.previousState) {
            this.calculator.setState(this.previousState);
        }
    }
}

class CommandHistory {
    constructor() {
        this.commands = [];
        this.currentIndex = -1;
        this.maxHistory = 50;
    }

    execute(command) {
        // Remove any commands after current index
        this.commands = this.commands.slice(0, this.currentIndex + 1);
        
        const result = command.execute();
        this.commands.push(command);
        this.currentIndex++;
        
        // Limit history size
        if (this.commands.length > this.maxHistory) {
            this.commands.shift();
            this.currentIndex--;
        }
        
        return result;
    }

    undo() {
        if (this.currentIndex >= 0) {
            const command = this.commands[this.currentIndex];
            command.undo();
            this.currentIndex--;
            return true;
        }
        return false;
    }

    canUndo() {
        return this.currentIndex >= 0;
    }
}

// Export for use in other modules
window.Command = Command;
window.CalculationCommand = CalculationCommand;
window.CommandHistory = CommandHistory;