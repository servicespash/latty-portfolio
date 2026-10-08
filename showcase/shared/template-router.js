// Shared Template Router for Cymatic Showcase
// This script centralizes navigation logic and handles communication with the parent React app.

(function() {
    function applyNavigation(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page-view');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update Navigation active states
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            // Template specific classes are handled by checking what's present
            const activeClasses = ['text-academy-teal', 'text-hope-forest', 'text-sora-dark', 'text-apex-accent'];
            activeClasses.forEach(cls => link.classList.remove(cls));
        });

        const activeLink = document.getElementById(`nav-${pageId}`);
        if (activeLink) {
            // Heuristic to find the right active class based on the template
            if (document.body.classList.contains('template-academy')) activeLink.classList.add('text-academy-teal');
            if (document.body.classList.contains('template-hope')) activeLink.classList.add('text-hope-forest');
            if (document.body.classList.contains('template-sora')) activeLink.classList.add('text-sora-dark');
            if (document.body.classList.contains('template-apex')) activeLink.classList.add('text-apex-accent');
        }

        // Scroll back to top on navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Export to global scope
    window.navigateTo = function(pageId) {
        // Resolve absolute path for reporting
        const absolutePath = (pageId.startsWith('/') || pageId.startsWith('http')) ? pageId : '/' + pageId;

        // Report to parent for unified state management and analytics
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'NAVIGATE_TO',
                pageId: absolutePath, // Use absolute path here
                templateId: window.templateId || 'unknown'
            }, '*');
        }
        
        // If pageId looks like a full URL, navigate there
        if (pageId.startsWith('http')) {
            window.location.href = pageId;
            return;
        }

        // Apply locally
        applyNavigation(pageId);
    };

    // Listen for messages from parent (for unified state sync)
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'SYNC_NAVIGATION') {
            applyNavigation(event.data.pageId);
        }
    });

    // Mobile Menu Toggle (Shared logic)
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('mobile-menu');
        const icon = document.getElementById('menu-icon');
        if (!menu) return;

        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            if (icon) icon.className = "fa-solid fa-xmark text-2xl";
        } else {
            menu.classList.add('hidden');
            if (icon) icon.className = "fa-solid fa-bars text-2xl";
        }
    };
})();
