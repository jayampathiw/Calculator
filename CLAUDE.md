# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an Enterprise Calculator project that demonstrates advanced JavaScript design patterns and modern web development practices. The project is now fully implemented with a modular file structure separating CSS, JavaScript, and HTML components.

## Current Architecture
The calculator implements the following structure:

### Design Patterns Implemented
- **Singleton Pattern**: Logger service for centralized logging (`js/patterns/singleton-logger.js`)
- **Module Pattern**: Component encapsulation (CalculatorModel, CalculatorView, CalculatorController)
- **MVC Architecture**: Clear separation between Model (`js/model/`), View (`js/view/`), and Controller (`js/controller/`)
- **Strategy Pattern**: Different calculation strategies (`js/patterns/strategy-calculations.js`)
- **Command Pattern**: Undo/Redo system with 50-operation history (`js/patterns/command-history.js`)
- **Observer Pattern**: Event system for component communication (`js/patterns/observer-events.js`)
- **State Pattern**: Calculator state management (`js/patterns/state-calculator.js`)
- **Repository Pattern**: Data persistence with localStorage (`js/patterns/repository-storage.js`)

### Core Components Structure
```
├── Model (CalculatorModel)
│   ├── State Management
│   ├── Business Logic  
│   ├── Data Persistence
│   └── Event Emission
├── View (CalculatorView)
│   ├── DOM Manipulation
│   ├── UI Updates
│   ├── Theme Management
│   └── Accessibility Features
├── Controller (CalculatorController) 
│   ├── User Input Handling
│   ├── Event Coordination
│   └── Validation
└── Services
    ├── Logger (Singleton)
    ├── Storage Repository
    ├── Event Emitter
    └── Command History
```

## File Structure
The project is organized as follows:

```
Calculator/
├── index.html                           # Main HTML file
├── css/                                 # Stylesheets
│   ├── base.css                        # CSS reset and theme variables
│   ├── calculator.css                  # Main calculator container styles  
│   ├── display.css                     # Display area styles
│   ├── buttons.css                     # Button styles and variants
│   ├── keypad.css                      # Keypad layout
│   ├── components.css                  # UI components (toast, history)
│   └── responsive.css                  # Mobile responsiveness
├── js/                                 # JavaScript modules
│   ├── patterns/                       # Design pattern implementations
│   │   ├── singleton-logger.js         # Logger singleton
│   │   ├── strategy-calculations.js    # Calculation strategies
│   │   ├── command-history.js          # Undo/redo commands
│   │   ├── observer-events.js          # Event emitter
│   │   ├── state-calculator.js         # State pattern
│   │   └── repository-storage.js       # Data persistence
│   ├── model/
│   │   └── calculator-model.js         # MVC Model layer
│   ├── view/
│   │   └── calculator-view.js          # MVC View layer
│   ├── controller/
│   │   └── calculator-controller.js    # MVC Controller layer
│   └── main.js                         # Application entry point
├── README.md                           # Project documentation
└── CLAUDE.md                           # Development guidelines
```

## Implementation Guidelines

### File Loading Order
JavaScript files must be loaded in dependency order as shown in index.html:
1. Design patterns (independent modules)
2. MVC components (depend on patterns)
3. Main application (depends on MVC)

### Key Features to Implement
- Basic arithmetic operations (+, -, ×, ÷, %)
- Scientific functions (sin, cos, tan, log, ln, √, x², x!)
- Memory functions (MC, MR, M+, M-)
- Calculation history with persistence (up to 100 calculations)
- Undo/Redo system (50 operations)
- Dark/Light theme toggle
- Full keyboard support
- Screen reader accessibility (WCAG 2.1 AA compliance)
- Responsive design (mobile-first)

### Development Standards
- Use ES6+ features consistently
- Implement comprehensive error handling
- Add JSDoc comments for documentation
- Follow accessibility best practices
- Use debouncing for performance optimization
- Implement proper memory management
- Use event delegation for performance

### Performance Requirements
- First Contentful Paint: < 100ms
- Time to Interactive: < 200ms  
- Bundle size: Single HTML file < 50KB
- 60fps UI updates using debouncing

### Accessibility Requirements
- Full keyboard navigation support
- Screen reader announcements for calculations
- High contrast ratios (4.5:1 minimum)
- Large touch targets (44px minimum)
- ARIA labels and live regions

### Testing Approach
When implementing tests, use:
- Unit tests for each component (Model, View, Controller)
- Integration tests for complete calculation workflows
- Performance tests for rapid calculations
- Accessibility testing with screen readers

### Build and Development
- No build process required - modular file structure with HTML, CSS, and JS separation
- Open index.html directly in modern web browsers or use local development server
- All files are loaded via standard `<link>` and `<script>` tags
- Browser compatibility: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Development Commands
- Open `index.html` in browser for testing
- Use browser developer tools for debugging
- All patterns are implemented as separate modules for maintainability

### Code Style
- Use consistent ES6+ syntax
- Follow existing naming conventions from README examples
- Implement comprehensive error boundaries
- Use CSS custom properties for theming
- Follow mobile-first responsive design principles

## Current Status
- Project is fully implemented with modular architecture
- All design patterns are implemented as separate modules
- MVC architecture with proper separation of concerns
- Full feature set including basic/scientific modes, memory functions, history, themes
- Ready for testing and further development

## Maintenance Notes
- When adding new features, follow the established pattern structure
- CSS changes should be made in the appropriate component file
- JavaScript changes should maintain the MVC separation
- New design patterns should be added to the `js/patterns/` directory