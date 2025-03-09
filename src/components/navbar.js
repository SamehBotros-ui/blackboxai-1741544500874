import { i18n } from '../services/i18n.js';

export function initNavigation() {
    const navItems = document.querySelectorAll('nav a');
    
    // Initialize navigation items with translations
    updateNavigationText();
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active state from all items
            navItems.forEach(nav => {
                nav.classList.remove('text-primary');
                nav.classList.add('text-gray-500', 'dark:text-gray-400');
            });
            
            // Add active state to clicked item
            item.classList.remove('text-gray-500', 'dark:text-gray-400');
            item.classList.add('text-primary');
            
            // Handle navigation
            const route = item.getAttribute('href').substring(1);
            navigateTo(route);
        });
    });

    // Listen for language changes
    window.addEventListener('languagechange', updateNavigationText);
    
    // Initial route
    const initialRoute = window.location.hash.slice(1) || 'search';
    navigateTo(initialRoute);
}

function updateNavigationText() {
    const navTexts = {
        'search': 'search',
        'post-job': 'postJob',
        'learn': 'learn',
        'marketplace': 'market',
        'community': 'community',
        'chat': 'chat'
    };
    
    const navItems = document.querySelectorAll('nav a span');
    navItems.forEach(item => {
        const route = item.parentElement.getAttribute('href').substring(1);
        const translationKey = navTexts[route];
        if (translationKey) {
            item.textContent = i18n.translate(translationKey);
        }
    });
}

async function navigateTo(route) {
    const app = document.getElementById('app');
    
    try {
        // Show loading state
        app.innerHTML = `
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        `;
        
        // Update URL hash
        window.location.hash = route;
        
        // Load component
        let content;
        switch (route) {
            case 'search':
                const searchModule = await import('./search.js');
                content = searchModule.default();
                break;
            case 'post-job':
                const postJobModule = await import('./post-job.js');
                content = postJobModule.default();
                break;
            case 'learn':
                const learnModule = await import('./learn.js');
                content = learnModule.default();
                break;
            case 'marketplace':
                const marketplaceModule = await import('./marketplace.js');
                content = marketplaceModule.default();
                break;
            case 'community':
                const communityModule = await import('./community.js');
                content = communityModule.default();
                break;
            case 'chat':
                const chatModule = await import('./chat.js');
                content = chatModule.default();
                break;
            default:
                content = `
                    <div class="text-center py-12">
                        <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300">
                            ${i18n.translate('pageNotFound')}
                        </h2>
                    </div>
                `;
        }
        
        // Update content
        app.innerHTML = content;
        
        // Initialize component if it has an init function
        const module = await import(`./${route}.js`);
        if (module.init) {
            module.init();
        }
        
    } catch (error) {
        console.error('Error loading content:', error);
        app.innerHTML = `
            <div class="text-center py-12">
                <div class="text-red-500 mb-4">
                    <i class="fas fa-exclamation-circle text-4xl"></i>
                </div>
                <h2 class="text-xl font-semibold text-red-500">
                    ${i18n.translate('error')}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                    ${i18n.translate('errorLoadingContent')}
                </p>
            </div>
        `;
    }
}

// Export navigation utilities
export const navigation = {
    navigateTo,
    getCurrentRoute: () => window.location.hash.slice(1) || 'search'
};
