const fs = require('fs');
let file = 'assets/js/main.js';
let content = fs.readFileSync(file, 'utf8');

// The mobile menu doesn't work locally probably because main.js isn't firing correctly
// Let's add explicit console logs and fix the event listener to use event delegation 
// because maybe the button is being recreated or the DOM isn't fully loaded

const replace = `function initMobileMenu() {
    console.log("initMobileMenu called");
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.mobile-menu-toggle');
        if (toggleBtn) {
            console.log("mobile toggle clicked!");
            e.preventDefault();
            const headerNav = document.querySelector('.header__nav');
            if (headerNav) {
                const isActive = headerNav.classList.contains('active');
                if (isActive) {
                    headerNav.classList.remove('active');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                } else {
                    headerNav.classList.add('active');
                    toggleBtn.setAttribute('aria-expanded', 'true');
                }
            } else {
                console.error("No header__nav found");
            }
        }
    });
}`;

// Find the entire old function
const regex = /function initMobileMenu\(\) \{[\s\S]*?\}\n\}/;
content = content.replace(regex, replace);

fs.writeFileSync(file, content);
console.log("Rewrote initMobileMenu in main.js to use event delegation");
