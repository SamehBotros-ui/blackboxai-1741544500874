export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = themeToggle.querySelector('.fa-moon');
    const sunIcon = themeToggle.querySelector('.fa-sun');
    
    // Check for saved theme preference or default to light
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update icons based on current theme
    updateIcons();
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        
        // Save preference
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        
        // Update icons
        updateIcons();
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!('theme' in localStorage)) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            updateIcons();
        }
    });
}

function updateIcons() {
    const moonIcon = document.querySelector('.fa-moon');
    const sunIcon = document.querySelector('.fa-sun');
    
    if (document.documentElement.classList.contains('dark')) {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    }
}

// Export theme utilities
export const theme = {
    isDark: () => document.documentElement.classList.contains('dark'),
    setDark: () => {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        updateIcons();
    },
    setLight: () => {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        updateIcons();
    },
    toggle: () => {
        document.documentElement.classList.toggle('dark');
        localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        updateIcons();
    }
};
