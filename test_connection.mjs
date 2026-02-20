
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const envConfig = {};
        envFile.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                envConfig[key] = value;
            }
        });
        return envConfig;
    } catch (e) {
        return {};
    }
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const DB_URL = env.DATABASE_URL;

console.log("--- SUPABASE CONNECTION TEST ---");

if (!SUPABASE_URL || !ANON_KEY) {
    console.error("❌ MISSING CONFIG: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env");
    process.exit(1);
}

console.log(`URL: ${SUPABASE_URL}`);

// Test 1: Public Anon Client
console.log("\n1. Testing Public API Connection (Anon Key)...");
try {
    const supabase = createClient(SUPABASE_URL, ANON_KEY);
    const { data, error } = await supabase.from('leads').select('count', { count: 'exact', head: true });

    if (error) {
        console.error(`❌ Connection Failed: ${error.message}`);
    } else {
        console.log(`✅ Connected! (Found ${data || 'N/A'} rows in 'leads' - access limited by RLS)`);
    }
} catch (e) {
    console.error(`❌ Client Error: ${e.message}`);
}

// Test 2: Service Role Client
if (SERVICE_KEY) {
    console.log("\n2. Testing Admin API Connection (Service Role Key)...");
    try {
        const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
        // Try listing buckets, which usually requires auth
        const { data: buckets, error } = await adminClient.storage.listBuckets();

        if (error) {
            console.error(`❌ Admin Connection Failed: ${error.message}`);
        } else {
            console.log(`✅ Admin Access Confirmed! (Found ${buckets ? buckets.length : 0} storage buckets)`);
        }
    } catch (e) {
        console.error(`❌ Admin Client Error: ${e.message}`);
    }
} else {
    console.log("\n⚠️  Skipping Admin Test: SUPABASE_SERVICE_ROLE_KEY not found.");
}

// Test 3: Postgres Direct Connection (if available)
if (DB_URL) {
    console.log("\n3. Testing Direct Database Connection (Postgres)...");
    // We'd need 'pg' module, but let's just print that we see the string
    console.log("ℹ️  DATABASE_URL found. (Full connection test requires 'pg' driver, but presence is good sign.)");
    // If we really wanted to test, we'd need to install pg or similar. 
    // Since we likely don't have it installed in package.json, we'll skip actual connection.
} else {
    console.log("\nℹ️  Skipping Direct DB Test: DATABASE_URL not found in .env");
}

console.log("\n--------------------------------");
