document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initSlider();
    initAccordions();
    initMobileMenu();
});

// Interactive Before/After Slider
function initSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    const beforeImage = slider.querySelector('.hero__image--before');
    const handle = slider.querySelector('.hero__slider-handle');
    let isDown = false;

    function updateSlider(x) {
        const sliderRect = slider.getBoundingClientRect();
        // Calculate position relative to the slider
        let offsetX = x - sliderRect.left;

        // Clamp valid values
        if (offsetX < 0) offsetX = 0;
        if (offsetX > sliderRect.width) offsetX = sliderRect.width;

        const percentage = (offsetX / sliderRect.width) * 100;

        beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        handle.style.left = `${percentage}%`;
    }

    // Mouse Events
    handle.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
    });

    window.addEventListener('mouseup', () => {
        isDown = false;
        if (slider) slider.classList.remove('active');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        updateSlider(e.clientX);
        e.preventDefault();
    });

    // Touch Events
    handle.addEventListener('touchstart', (e) => {
        isDown = true;
    });

    window.addEventListener('touchend', () => {
        isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        updateSlider(e.touches[0].clientX);
        e.preventDefault();
    });

    // Click-to-move support
    slider.addEventListener('click', (e) => {
        updateSlider(e.clientX);
    });
}

// Accordion Logic
function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header, .faq-accordion__header');

    headers.forEach((header, index) => {
        // Determine parent and content based on class
        const isFaq = header.classList.contains('faq-accordion__header');
        const itemClass = isFaq ? '.faq-accordion__item' : '.accordion-item';
        const contentClass = isFaq ? '.faq-accordion__content' : '.accordion-content';

        const item = header.closest(itemClass);
        const content = item.querySelector(contentClass);

        if (!item || !content) return;

        // Generate unique ID for accessibility if not present
        const contentId = content.id || `accordion-content-${index}`;
        content.id = contentId;
        header.setAttribute('aria-controls', contentId);

        // Set initial state
        const isActive = item.classList.contains('active');
        header.setAttribute('aria-expanded', isActive);

        header.addEventListener('click', () => {
            const currentlyActive = item.classList.contains('active');

            // Toggle active class
            item.classList.toggle('active');

            // Update aria-expanded
            header.setAttribute('aria-expanded', !currentlyActive);
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header__nav');

    if (toggleBtn && headerNav) {
        toggleBtn.addEventListener('click', () => {
            const isActive = headerNav.classList.contains('active');
            if (isActive) {
                headerNav.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                headerNav.classList.add('active');
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
        });
    }
}
