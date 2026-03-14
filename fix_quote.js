const fs = require('fs');

/*
The issue:
In quote.html we have:
<script src="./src/js/quote-logic.js" type="module"></script>
And right after it we have an inline script:
<!-- Standalone Submission Script for Local/File-based Testing -->
<script>
    // These keys are safe for frontend use (public)
    const SUPABASE_URL = "https://rjwaunghmcihpmockiap.supabase.co";
...
Both are attaching a submit listener to the form.
When built with Vite, this might cause duplicates or conflicts.
Wait, if the user clicked "Get My Free Quote" and nothing happens, it means an error occurred in JS that stopped the submission.
Or it means preventDefault() was called but the subsequent logic failed silently.
Let's see what happens if they don't have Supabase URL in env when Vite builds.
Oh! In src/js/quote-logic.js:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

If VITE_SUPABASE_URL isn't set during `vite build` on DigitalOcean (which it often isn't unless explicitly passed as an env var), `import.meta.env.VITE_SUPABASE_URL` is `undefined`!
Wait, `import.meta.env.VITE_SUPABASE_URL` is hardcoded at build time by Vite. If DO didn't have the env vars, it crashes or replaces with undefined.
Then `fetch(undefined + '/rest/v1/...` fails with Invalid URL, or similar, breaking the form!
Since the user relies on quote.html having a standalone script as a fallback, BUT quote-logic.js also attaches, maybe they collide.

Actually, the inline script uses hardcoded keys, which is safer if they didn't add env vars to DO.
Let's check if there are two listeners.
In src/js/quote-logic.js:
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('quoteForm');
        // Remove any existing listeners by cloning...
        const newForm = form.cloneNode(true);

Wait! In quote.html, there is ALSO:
    // Attach listener
    document.addEventListener('DOMContentLoaded', function () {
      const form = document.getElementById('quoteForm');
      if (form) {
        // Remove any existing listeners by cloning...
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        newForm.addEventListener('submit', handleFormSubmit);

They are BOTH trying to clone the form and replace it to remove exist listeners.
Race condition! One clones it, attaches its listener. Then the OTHER clones that clone, wiping out the first one's listener, and attaches its own.
If src/js/quote-logic.js wins the race, it uses `import.meta.env.VITE_SUPABASE_URL`. If DO didn't have the env vars, it crashes.
If quote.html wins the race, it uses the hardcoded keys.

Wait, why do we have TWO identical scripts?
Let's remove the inline `<script>` block for form submission in `quote.html` entirely and just ensure the `src/js/quote-logic.js` has the keys (or we provide them some other way, OR we use the hardcoded ones in `quote-logic.js` if env is undefined).

Let's check `src/js/quote-logic.js`:
        // 2. Insert into DB using Direct REST API
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

If VITE_SUPABASE_URL is undefined when built, this will throw.
Let's fix quote-logic.js to fallback to the hardcoded keys if `import.meta.env` properties are undefined.
*/
