
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

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    try {
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        // Dynamic import of Supabase
        const { supabase } = await import('../lib/supabase.js');

        const formData = new FormData(form);

        // --- Supabase Integration ---

        // 1. Prepare Data Object
        const projectTypes = formData.getAll('project_type');

        const leadPayload = {
            // -- Contact Info --
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || null,

            // -- Location Info --
            address: formData.get('address'),
            city: formData.get('city'),
            postal_code: formData.get('postalCode'),

            // -- Project Details --
            package_interest: formData.get('package'),
            project_type: projectTypes,
            approximate_size: formData.get('size'),
            timeline: formData.get('timeline'),

            // -- Marketing & Context --
            referral_source: formData.get('howHeard'),
            message_content: formData.get('message'),
        };

        console.log("Submitting Payload:", leadPayload);

        // 2. Insert into DB using Direct REST API
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        const rpcEndpoint = `${supabaseUrl}/rest/v1/rpc/submit_lead_v2`;

        const response = await fetch(rpcEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify({ payload: leadPayload })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.message || response.statusText}`);
        }

        const leadId = await response.json();
        console.log("Lead Created via RPC:", leadId);

        // 3. Upload Photos
        const imageFiles = document.getElementById('yardImage')?.files;

        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const imageFile = imageFiles[i];
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${leadId}/${Date.now()}_${i}_original.${fileExt}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('raw_uploads')
                    .upload(fileName, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error(`Photo Upload Failed for file ${imageFile.name}:`, uploadError);
                    continue;
                }

                // 4. Link Photo to Lead using RPC
                const { error: photoLinkError } = await supabase.rpc('link_photo_to_lead', {
                    p_lead_id: leadId,
                    p_original_path: uploadData.path
                });

                if (photoLinkError) {
                    console.error("Photo Link Failed:", photoLinkError);
                }
            }
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
