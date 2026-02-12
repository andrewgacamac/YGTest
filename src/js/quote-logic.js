
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

            // -- Location Info --
            address: formData.get('address'), // Street Address
            city: formData.get('city'),
            postal_code: formData.get('postalCode'),

            // -- Project Details --
            package_interest: formData.get('package'), // Radio button (single value)
            project_type: projectTypes,                // Array of strings (e.g. ["backyard", "patio"])
            approximate_size: formData.get('size'),    // Select dropdown
            timeline: formData.get('timeline'),        // Select dropdown

            // -- Marketing & Context --
            referral_source: formData.get('howHeard'),
            message_content: formData.get('message'),  // Textarea
        };

        console.log("Submitting Payload:", leadPayload); // Debugging aid

        // 2. Insert into DB using Direct REST API (Bypasses Supabase Client Cache Issues)
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

        // The RPC returns just the UUID string, like "123e4567-e89b..."
        // It might return it wrapped in quotes, so handle that if needed, 
        // but typically .json() parses it.
        const leadId = await response.json();

        console.log("Lead Created via RPC:", leadId);

        // 3. Upload Photos (If User Selected Any)
        const imageFiles = document.getElementById('yardImage')?.files;

        if (imageFiles && imageFiles.length > 0) {
            for (let i = 0; i < imageFiles.length; i++) {
                const imageFile = imageFiles[i];
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${leadId}/${Date.now()}_${i}_original.${fileExt}`;

                // Upload file to bucket (Storage RLS usually works better, but we can fix if needed)
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
