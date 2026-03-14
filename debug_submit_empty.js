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
        address: "",
        city: "",
        postal_code: "",
        package_interest: null,
        project_type: [],
        approximate_size: null,
        timeline: null,
        referral_source: null,
        message_content: "",
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
    console.log("Status:", response.status);
    console.log("Response:", await response.text());
}
run();
