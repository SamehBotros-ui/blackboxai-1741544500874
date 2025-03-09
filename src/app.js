// Import services
import { initTheme } from './services/theme.js';
import { initI18n } from './services/i18n.js';
import { initAuth } from './components/auth.js';
import { initNavigation } from './components/navbar.js';
import { initSidebar } from './components/sidebar.js';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize internationalization
    initI18n();
    
    // Initialize authentication
    initAuth();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize sidebar
    initSidebar();
});

// Handle routing
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || 'search';
    loadContent(hash);
});

// Load content based on route
async function loadContent(route) {
    const app = document.getElementById('app');
    
    try {
        // Show loading state
        app.innerHTML = '<div class="flex justify-center items-center h-64"><i class="fas fa-spinner fa-spin text-3xl text-primary"></i></div>';
        
        // Load component based on route
        const module = await import(`./components/${route}.js`);
        const content = module.default();
        app.innerHTML = content;
        
        // Initialize component
        if (module.init) {
            module.init();
        }
    } catch (error) {
        console.error('Error loading content:', error);
        app.innerHTML = '<div class="text-center text-red-500">Error loading content</div>';
    }
}
