const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');

let supabaseUrl = '';
let supabaseKey = '';
env.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        let val = line.substring(line.indexOf('=') + 1).trim();
        supabaseKey = val.replace(/['"]/g, '');
    }
});

async function run() {
    const linkRpcEndpoint = `${supabaseUrl}/rest/v1/rpc/link_photo_to_lead`;
    const response = await fetch(linkRpcEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
            p_lead_id: "c9d60657-e387-4126-8025-f4c5c338e039",
            p_original_path: "test_path.jpg"
        })
    });
    console.log("Status:", response.status);
    console.log("Response:", await response.text());
}
run();
