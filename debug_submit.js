const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

env.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].replace(/['"]/g, '').trim();
});

async function run() {
    const leadPayload = {
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        phone: null,
        address: "123 Test St",
        city: "Test",
        postal_code: "12345",
        package_interest: "pet-yard",
        project_type: ["backyard"],
        approximate_size: "100-200",
        timeline: "asap",
        referral_source: "google",
        message_content: "Test\n\n--- Attached Photos ---\ntest.jpg",
    };

    const rpcEndpoint = `${supabaseUrl}/rest/v1/rpc/submit_lead_v2`;

    const response = await fetch(rpcEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ payload: leadPayload })
    });

    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
}
run();
