/**
 * @fileoverview Repository Pattern - Data Persistence
 * Handles data storage and retrieval with localStorage
 */

// REPOSITORY PATTERN - Data Persistence
class StorageRepository {
    constructor(storageKey = 'calculator-data') {
        this.storageKey = storageKey;
    }

    save(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            if (window.Logger) {
                window.Logger.getInstance().log('error', 'Failed to save data', error);
            }
            return false;
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            if (window.Logger) {
                window.Logger.getInstance().log('error', 'Failed to load data', error);
            }
            return null;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            if (window.Logger) {
                window.Logger.getInstance().log('error', 'Failed to clear data', error);
            }
            return false;
        }
    }
}

// Export for use in other modules
window.StorageRepository = StorageRepository;