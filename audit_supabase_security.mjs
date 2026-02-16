
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://rjwaunghmcihpmockiap.supabase.co';
const ANON_KEY = 'sb_publishable_2wpXUJklTjkVJGAJnb5Wqg_6DG55FRO';

// Initialize Supabase Client (Simulating a Public User)
const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function runSecurityAudit() {
    console.log("--- STARTING SUPABASE SECURITY AUDIT ---");
    console.log(`Target: ${SUPABASE_URL}`);
    console.log("Actor: Public/Anonymous User (Simulating Hacker)\n");

    let criticalIssues = 0;
    let warnings = 0;

    // TEST 1: Direct Table Access (Should be BLOCKED by RLS)
    console.log("1. Testing Direct Table READ Access (RLS)...");

    // Attempt 1a: Read Leads
    const { data: leads, error: leadsError } = await supabase.from('leads').select('*').limit(5);
    if (!leadsError && leads.length > 0) {
        console.error("❌ CRITICAL: Public user can READ 'leads' table! RLS is weak/missing.");
        criticalIssues++;
    } else {
        console.log("✅ 'leads' table read access denied/empty (Safe).");
    }

    // Attempt 1b: Read Photos
    const { data: photos, error: photosError } = await supabase.from('photos').select('*').limit(5);
    if (!photosError && photos.length > 0) {
        console.error("❌ CRITICAL: Public user can READ 'photos' table! RLS is weak/missing.");
        criticalIssues++;
    } else {
        console.log("✅ 'photos' table read access denied/empty (Safe).");
    }

    // TEST 2: Direct Insert Access (Should be BLOCKED now)
    console.log("\n2. Testing Direct Table INSERT Access (Should Fail)...");

    // Attempt to insert junk data directly into 'leads' without using the RPC
    const junkData = {
        first_name: "HACKER",
        last_name: "TEST",
        email: "hacker@test.com",
        status: "SPAM"
    };

    const { data: insertData, error: insertError } = await supabase
        .from('leads')
        .insert([junkData])
        .select();

    if (!insertError) {
        console.error("❌ CRITICAL: Public user can INSERT directly into 'leads' table!");
        console.error("   This confirms the 'Always True' policy is still active.");
        criticalIssues++;
    } else {
        console.log("✅ Direct INSERT into 'leads' was BLOCKED.");
        console.log("   (Error: " + insertError.message + ")");
    }

    // TEST 3: Storage Bucket Access (Should be RESTRICTED)
    console.log("\n3. Testing Storage Bucket Access...");
    const { data: files, error: storageError } = await supabase.storage.from('raw_uploads').list();
    if (!storageError && files.length > 0) {
        // Listing might be allowed
        console.warn("⚠️ WARNING: Public user can LIST files in 'raw_uploads' bucket.");
        warnings++;

        console.log("   Attempting to download first file...");
        const { data: dl, error: dlError } = await supabase.storage.from('raw_uploads').download(files[0].name);
        if (!dlError) {
            console.error("❌ CRITICAL: Public user can DOWNLOAD files from 'raw_uploads'.");
            criticalIssues++;
        } else {
            console.log("✅ Download denied (RLS working).");
        }
    } else {
        console.log("✅ Storage bucket list access denied or empty (Safe).");
    }

    // TEST 4: RPC Function Exposure
    console.log("\n4. Testing RPC Function Availability...");
    // Check if expected function exists
    const { error: rpcError } = await supabase.rpc('submit_lead_v2', { payload: {} });

    // We expect a database constraint/logic error, NOT a "function not found" error
    if (rpcError && rpcError.message && rpcError.message.includes("function") && rpcError.message.includes("not found")) {
        console.error("❌ ERROR: 'submit_lead_v2' function is NOT found/exposed!");
        criticalIssues++;
    } else {
        console.log("✅ 'submit_lead_v2' is exposed and callable (Good).");
    }

    console.log("\n--------------------------------------------------");
    if (criticalIssues === 0) {
        console.log(`🎉 AUDIT PASSED: System is secure.`);
        if (warnings > 0) console.log(`   (${warnings} non-critical warnings found)`);
    } else {
        console.error(`🚨 AUDIT FAILED: Found ${criticalIssues} critical issues.`);
    }
    console.log("--------------------------------------------------");
}

runSecurityAudit();
