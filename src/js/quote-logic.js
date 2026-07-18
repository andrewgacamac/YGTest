
// UI Logic for Multi-step Form
// We use dynamic imports to ensure UI works even if backend modules fail initially.

// Expose navigation functions globally immediately
window.nextStep = function (targetStep) {
    console.log("Navigating to step", targetStep); // Debug log

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));

    // Show target step
    const targetStepEl = document.querySelector(`.form-step[data-step="${targetStep}"]`);
    if (targetStepEl) {
        targetStepEl.classList.add('active');
    } else {
        console.error("Target step not found:", targetStep);
    }

    // Update progress bar
    document.querySelectorAll('.form-progress__step').forEach(p => {
        const pStep = parseInt(p.dataset.step);
        if (pStep < targetStep) {
            p.classList.add('completed');
            p.classList.remove('active');
        } else if (pStep === targetStep) {
            p.classList.add('active');
            p.classList.remove('completed');
        } else {
            p.classList.remove('active', 'completed');
        }
    });

    // Re-initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Scroll to top
    const formContainer = document.querySelector('.quote-form-container');
    if (formContainer) formContainer.scrollIntoView({ behavior: 'smooth' });
}

window.prevStep = function (step) {
    window.nextStep(step);
}

function validateStep(stepEl) {
    const inputs = stepEl.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('error');
            // Ensure error message is visible
            const errorMsg = input.parentNode.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'block';
        } else {
            input.classList.remove('error');
            const errorMsg = input.parentNode.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'none';
        }
    });

    return isValid;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();

    // Check for package parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    if (packageParam) {
        const packageInput = document.getElementById(packageParam);
        if (packageInput) {
            packageInput.checked = true;
        }
    }

    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // input listener to remove error class on type
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorMsg = input.parentNode.querySelector('.form-error');
            if (errorMsg) errorMsg.style.display = 'none';
        });
    });
});

// Endpoint that emails the lead to the owner. Same-origin "/api/quote" by
// default (proxied in dev, routed to the backend in prod); override with
// window.QUOTE_ENDPOINT or VITE_QUOTE_ENDPOINT if the backend is elsewhere.
const QUOTE_ENDPOINT =
    (typeof window !== 'undefined' && window.QUOTE_ENDPOINT) ||
    import.meta.env.VITE_QUOTE_ENDPOINT ||
    '/api/quote';

// Client-side guard so oversized photos are caught before upload. Photos are
// sent untransformed; we only reject, never resize.
const MAX_FILE_BYTES = 10 * 1024 * 1024; // must match the server limit

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Reject oversized photos up front with a clear message (originals unchanged).
    const imageFiles = document.getElementById('yardImage')?.files;
    if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
            if (file.size > MAX_FILE_BYTES) {
                alert(`The photo "${file.name}" is larger than 10MB. Please choose a smaller image, or remove it — photos are optional.`);
                return;
            }
        }
    }

    try {
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        // Send the whole form (fields + any photos) as multipart/form-data.
        // The backend validates it and emails the lead via Resend.
        const formData = new FormData(form);

        const response = await fetch(QUOTE_ENDPOINT, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            let message = 'Something went wrong. Please try again or call (647) 216-7787.';
            try {
                const errorData = await response.json();
                if (errorData && errorData.error) message = errorData.error;
            } catch (_) { /* non-JSON error, keep default */ }
            throw new Error(message);
        }

        // GA4 Macro-conversion: Lead Generation
        if (typeof window.gtag === 'function') {
            gtag('event', 'generate_lead', {
                'event_category': 'Leads',
                'event_label': 'Quote Form Submitted',
                'value': 1
            });
        }

        // Success State
        form.style.display = 'none';
        document.querySelector('.form-progress').style.display = 'none';
        document.getElementById('formSuccess').classList.add('active');
        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error('Submission Error:', error);
        alert('Error: ' + error.message);
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
