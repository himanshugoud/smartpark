// theme.js - Simple Light/Dark Toggle (no panel/dropdown)
// Advanced Theme System for SmartPark

class ThemeManager {
    constructor() {
        this.themes = {
            'light': 'Light',
            'dark': 'Dark'
        };
        
        this.currentTheme = 'light';
        this.preferredTheme = null;
        this.customColors = {};
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.createThemeToggle();
        this.applyTheme();
        this.setupListeners();
    }
    
    loadTheme() {
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('smartpark_theme');
        const savedPreferred = localStorage.getItem('smartpark_preferred_theme');
        
        console.log('Loading theme:', { savedTheme, savedPreferred });
        
        if (savedPreferred && this.themes[savedPreferred]) {
            // Person has explicitly picked light or dark before (via the
            // toggle button) — respect that choice.
            this.currentTheme = savedPreferred;
            this.preferredTheme = savedPreferred;
        } else {
            // No explicit choice saved yet — default to matching the
            // system/OS theme rather than always hardcoding light.
            this.preferredTheme = 'auto';
            this.detectSystemTheme();
        }
        
        this.applyTheme();
    }
    
    detectSystemTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('System prefers dark mode:', prefersDark);
        
        if (prefersDark) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
        
        console.log('Detected system theme:', this.currentTheme);
    }
    
    createThemeToggle() {
        // Create theme toggle button for navbar — this is the ONLY UI now;
        // no dropdown/panel of mode options.
        const themeToggleBtn = document.createElement('button');
        themeToggleBtn.className = 'theme-toggle-btn-navbar';
        themeToggleBtn.id = 'theme-toggle-btn';
        themeToggleBtn.title = 'Toggle Theme';
        themeToggleBtn.innerHTML = '<i class="fas fa-palette"></i>';
        
        // Add to navbar (next to Book Now button)
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            const bookNowBtn = document.getElementById('book-now-btn');
            if (bookNowBtn) {
                navActions.insertBefore(themeToggleBtn, bookNowBtn);
            } else {
                navActions.appendChild(themeToggleBtn);
            }
        }
        
        this.updateToggleButton();
    }
    
    setupListeners() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Keep following system theme changes in real time, but only for
        // as long as the person hasn't explicitly picked light/dark
        // themselves via the toggle button.
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.preferredTheme === 'auto') {
                this.detectSystemTheme();
                this.applyTheme();
            }
        });
    }
    
    // Simple flip between light and dark. This IS the explicit choice from
    // here on — it overrides system-following until localStorage is cleared.
    toggleTheme() {
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
    }
    
    setTheme(theme, notify = true) {
        if (!this.themes[theme]) return;
        
        const isActualChange = this.currentTheme !== theme;
        
        console.log('Setting theme to:', theme);
        
        // Update theme
        this.currentTheme = theme;
        this.preferredTheme = theme;
        
        // Apply theme
        this.applyTheme();
        this.updateToggleButton();
        this.saveTheme();
        
        // Only notify when the theme is genuinely changing AND the caller
        // wants a notification. Without this, simply loading/refreshing
        // the page — which re-applies whatever theme was already saved —
        // would show a "Theme changed to X" toast every single time, even
        // though nothing actually changed.
        if (notify && isActualChange) {
            this.showNotification(`Theme changed to ${this.themes[theme]}`);
        }
    }
    
    applyTheme() {
        console.log('Applying theme:', this.currentTheme);
        
        // Remove all theme attributes
        document.documentElement.removeAttribute('data-theme');
        
        // Apply current theme
        if (this.currentTheme && this.currentTheme !== 'light') {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
        }
        
        // Update UI elements
        this.updateToggleButton();
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        }));
    }
    
    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle-btn');
        if (!toggleBtn) return;
        
        // Update button icon based on theme
        let icon = 'fa-palette';
        
        if (this.currentTheme === 'dark') {
            icon = 'fa-moon';
        } else if (this.currentTheme === 'light') {
            icon = 'fa-sun';
        }
        
        toggleBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        
        // Update button title
        const themeName = this.themes[this.currentTheme] || 'Custom';
        toggleBtn.title = `Current Theme: ${themeName}\nClick to switch`;
    }
    
    saveTheme() {
        localStorage.setItem('smartpark_theme', this.currentTheme);
        localStorage.setItem('smartpark_preferred_theme', this.preferredTheme);
        console.log('Saved theme:', { current: this.currentTheme, preferred: this.preferredTheme });
    }
    
    showNotification(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'info');
            return;
        }
        
        // Fallback notification
        console.log('Theme notification:', message);
    }
    
    // Public subscription API used by theme-integration.js.
    // Wraps the existing 'themechange' document event so other files can do
    // themeManager.addThemeChangeListener(callback) instead of reaching into
    // document.addEventListener directly. Returns an unsubscribe function.
    addThemeChangeListener(callback) {
        if (typeof callback !== 'function') return () => {};
        
        const handler = (event) => callback(event);
        document.addEventListener('themechange', handler);
        
        // Allow callers to remove the listener later if needed
        return () => document.removeEventListener('themechange', handler);
    }
}

// Initialize theme manager
let themeManager;

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    window.themeManager = themeManager;
});

