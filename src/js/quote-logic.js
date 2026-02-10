
import { supabase } from '../lib/supabase.js';

// Expose navigation functions to window so inline onclick works
window.nextStep = function (step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    // Update progress bar
    document.querySelectorAll('.form-progress__step').forEach(p => {
        const pStep = parseInt(p.dataset.step);
        if (pStep < step) {
            p.classList.add('completed');
            p.classList.remove('active');
        } else if (pStep === step) {
            p.classList.add('active');
            p.classList.remove('completed');
        } else {
            p.classList.remove('active', 'completed');
        }
    });

    // Re-initialize icons
    if (window.lucide) window.lucide.createIcons();

    // Scroll to top of form
    const formContainer = document.querySelector('.quote-form-container');
    if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }
}

window.prevStep = function (step) {
    window.nextStep(step);
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
});

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    try {
        btn.innerHTML = 'Sending...';
        btn.disabled = true;

        const formData = new FormData(form);

        // --- Supabase Integration ---

        // 1. Prepare Data Object

        // helper to get all checkbox values properly
        // 'project_type' is a multi-select checkbox group
        const projectTypes = formData.getAll('project_type');

        const leadPayload = {
            // -- Contact Info --
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone') || null,

            // -- Location Info (Split for better data quality) --
            street_address: formData.get('address'),
            city: formData.get('city'),
            postal_code: formData.get('postalCode'),
            // Keep the 'address' field as a fallback/display string if existing logic depends on it
            address: [formData.get('address'), formData.get('city'), formData.get('postalCode')].filter(Boolean).join(', '),

            // -- Project Details --
            package_interest: formData.get('package'), // Radio button (single value)
            project_type: projectTypes,                // Array of strings (e.g. ["backyard", "patio"])
            approximate_size: formData.get('size'),    // Select dropdown
            timeline: formData.get('timeline'),        // Select dropdown

            // -- Marketing & Context --
            referral_source: formData.get('howHeard'),
            message_content: formData.get('message'),  // Textarea

            status: 'NEW'
        };

        console.log("Submitting Payload:", leadPayload); // Debugging aid

        // 2. Insert into DB
        if (!supabase) {
            throw new Error("Supabase client is not initialized. Missing environment variables?");
        }

        const { data: leadData, error: leadError } = await supabase
            .from('leads')
            .insert([leadPayload])
            .select()
            .single();

        if (leadError) {
            console.error("Lead Creation Failed:", leadError);
            console.error("Error Message:", leadError.message);
            console.error("Error Details:", leadError.details);
            console.error("Error Hint:", leadError.hint);
            throw new Error("Could not create lead: " + leadError.message);
        }

        const leadId = leadData.id;
        console.log("Lead Created:", leadId);

        // 3. Upload Photo (If User Selected One)
        const imageFile = document.getElementById('yardImage')?.files[0];

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${leadId}/${Date.now()}_original.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('raw_uploads')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Photo Upload Failed:", uploadError);
                throw new Error("Photo upload failed: " + uploadError.message);
            }

            // 4. Link Photo to Lead
            const { error: photoLinkError } = await supabase
                .from('photos')
                .insert([{
                    lead_id: leadId,
                    original_path: uploadData.path
                }]);

            if (photoLinkError) {
                console.error("Photo Link Failed:", photoLinkError);
                // Non-critical: Lead exists, File exists, but Link failed.
            }
        }

        // Success State
        form.style.display = 'none';
        document.querySelector('.form-progress').style.display = 'none';
        document.getElementById('formSuccess').classList.add('active');
        if (window.lucide) window.lucide.createIcons();

    } catch (error) {
        console.error('Submission Error:', error);

        // Detailed Debugging for User
        import('../lib/supabase.js').then(({ checkConfiguration }) => {
            const config = checkConfiguration();
            const debugMsg = `
Error: ${error.message}

--- Debug Info ---
Supabase URL: ${config.urlPreview} (Length: ${config.urlLength})
Supabase Key: ${config.keyPreview} (Length: ${config.keyLength})
Client Ready: ${config.isClientInitialized}
`;
            alert(debugMsg);
        });

        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}
