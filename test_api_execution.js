
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
    try {
        console.log("--- SQL EXECUTION VIA SUPABASE API ---");

        // Load credentials from hardcoded values (since env reading is flaky with requires)
        const URL = 'https://rjwaunghmcihpmockiap.supabase.co';
        // Check if we have the service role key
        // We will read it from .env directly to be safe
        let serviceKey = '';
        try {
            const content = fs.readFileSync('.env', 'utf8');
            const match = content.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
            if (match) serviceKey = match[1].trim();
        } catch (e) { }

        if (!serviceKey) {
            console.error("No service key found in .env");
            return;
        }

        // Initialize Supabase with Service Role
        const supabase = createClient(URL, serviceKey);

        console.log("Reading SQL file...");
        const sql = fs.readFileSync('harden_supabase_security.sql', 'utf8');

        console.log("Attempting to execute SQL via 'pg_net' or 'extensions' if available...");
        // This is a long shot: Supabase JS client doesn't support raw SQL execution
        // UNLESS there is a specific function for it.
        // BUT, we can use the 'rpc' method if we had a function like 'exec_sql'.
        // We don't.

        // HOWEVER, there is a Management API (v1) that might work if we have the access token.
        // Service Role Key is NOT a Management API token.

        console.log("Checking for existing 'submit_lead_v2'...");
        const { data, error } = await supabase.rpc('submit_lead_v2', { payload: {} });

        if (error && error.message.includes('function') && error.message.includes('not found')) {
            console.log("Function 'submit_lead_v2' is missing or restricted.");
        } else {
            console.log("Function 'submit_lead_v2' was found (or at least callable). This means connection works.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}
run();
