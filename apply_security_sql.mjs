
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Client } = require('pg');

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

async function run() {
    console.log("--- APPLYING SUPABASE SECURITY HARDENING ---");

    const env = loadEnv();
    let dbUrl = env.DATABASE_URL;

    if (!dbUrl) {
        console.error("❌ ERROR: DATABASE_URL not found in .env");
        process.exit(1);
    }

    // Fix: Remove the space after "postgres:" that was likely a copy-paste error
    // "postgresql://postgres: password@..." -> "postgresql://postgres:password@..."
    if (dbUrl.includes("postgres: ")) {
        console.log("ℹ️  Correcting malformed DATABASE_URL (removing extra space)...");
        dbUrl = dbUrl.replace("postgres: ", "postgres:");
    }

    // Trim whitespace
    dbUrl = dbUrl.trim();

    console.log(`Target: ${dbUrl.replace(/:[^:]+@/, ':****@')}`); // Mask password for log

    // Read SQL
    let sqlContent;
    try {
        sqlContent = fs.readFileSync('harden_supabase_security.sql', 'utf8');
    } catch (e) {
        console.error("❌ Failed to read 'harden_supabase_security.sql':", e.message);
        process.exit(1);
    }

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Database Connected.");

        console.log("Executing SQL...");
        await client.query(sqlContent);

        console.log("✅ SQL Applied Successfully!");
        console.log("   --> RPC functions updated (Secure)");
        console.log("   --> Insecure policies removed");
        console.log("   --> Config reloaded");

    } catch (e) {
        console.error("❌ Execution Error:");
        console.error(e.toString()); // Better error formatting
    } finally {
        await client.end();
    }
}

run();
