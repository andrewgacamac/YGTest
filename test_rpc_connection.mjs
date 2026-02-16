
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rjwaunghmcihpmockiap.supabase.co';
const ANON_KEY = 'sb_publishable_2wpXUJklTjkVJGAJnb5Wqg_6DG55FRO';

// Create a client using the public key (exactly like the website uses)
const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function testConnection() {
    console.log("--- Starting RPC Connection Test ---");
    console.log(`Target URL: ${SUPABASE_URL}`);
    console.log("Attempting to call 'submit_lead_v2'...");

    const payload = {
        first_name: "Test",
        last_name: "Script",
        email: "test@example.com",
        project_type: ["test"]
    };

    // Try calling it EXACTLY how the website does
    const { data, error } = await supabase.rpc('submit_lead_v2', {
        payload: payload
    });

    if (error) {
        console.error("\n❌ FAILED. Error details:");
        console.error(error);

        if (error.message.includes('function') && error.message.includes('schema cache')) {
            console.log("\n⚠️ DIAGNOSIS: The function is definitely MISSING or HIDDEN from the public API.");
            console.log("Possibilities:");
            console.log("1. The SQL was run on a different project?");
            console.log("2. The function was created in a schema other than 'public'?");
            console.log("3. The 'GRANT EXECUTE' permissions are missing.");
        }
    } else {
        console.log("\n✅ SUCCESS! Function exists and works.");
        console.log("Returned Lead ID:", data);
    }
}

testConnection();
