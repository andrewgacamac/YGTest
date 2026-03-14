const { Client } = require('pg');
const fs = require('fs');
async function run() {
    // try 5432 connection on the pooler
    const dbUrl = "postgresql://postgres.rjwaunghmcihpmockiap:Fiat-to-Jesionowa13@aws-0-ca-central-1.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const sql = fs.readFileSync('harden_supabase_security.sql', 'utf8');
        await client.query(sql);
        console.log("Success with 5432!");
    } catch(e) {
        console.log("Failed 5432:", e.message);
    }
}
run();
