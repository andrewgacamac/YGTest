
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables manually since we lack dotenv dependency
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return {};

        const envFile = fs.readFileSync(envPath, 'utf8');
        const envConfig = {};
        envFile.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                envConfig[key] = value;
            }
        });
        return envConfig;
    } catch (e) {
        console.error("Could not load .env file", e);
        return {};
    }
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://rjwaunghmcihpmockiap.supabase.co';
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
    console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env. Cannot perform administrative fixes.");
    process.exit(1);
}

// Initialize Supabase Client with Service Role (Admin)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function fixStorageSecurity() {
    console.log("--- SECURING STORAGE BUCKETS ---");
    console.log(`Target: ${SUPABASE_URL}`);
    console.log("Using: Service Role Key (Admin Access)\n");

    const bucketName = 'raw_uploads';

    // 1. Check Bucket Status
    console.log(`Checking bucket '${bucketName}'...`);
    const { data: bucket, error } = await supabase.storage.getBucket(bucketName);

    if (error) {
        console.error(`❌ Error retrieving bucket info: ${error.message}`);
        // If it doesn't exist, we can't fix it
        return;
    }

    if (bucket.public) {
        console.warn(`⚠️ Bucket '${bucketName}' is marked as PUBLIC.`);
        console.log("   This allows public listing of files if no RLS policy prevents it.");
        console.log("   Since 'raw_uploads' should be private (users upload, admin views), we should make it PRIVATE.");

        // 2. Update Bucket to be Private
        console.log(`   Attempting to set '${bucketName}' to PRIVATE...`);
        const { data: updated, error: updateError } = await supabase.storage.updateBucket(bucketName, {
            public: false,
            file_size_limit: 10485760, // 10MB (Preserving likely default or setting explicit)
            allowed_mime_types: ['image/*', 'application/pdf']
        });

        if (updateError) {
            console.error(`❌ Failed to update bucket: ${updateError.message}`);
        } else {
            console.log(`✅ Bucket '${bucketName}' is now PRIVATE.`);
        }
    } else {
        console.log(`✅ Bucket '${bucketName}' is already PRIVATE (Good).`);
    }

    // 3. Remove Public Policies on Storage Objects (if possible via API? No, usually SQL)
    // We can't easily drop SQL policies via JS client without RPC.

    console.log("\nNote: SQL Policies must still be managed via 'harden_supabase_security.sql' for fine-grained control.");
    console.log("--------------------------------------------------");
}

fixStorageSecurity();
