// Let's rewrite the URL to the default Supabase IPv4 address for db.
// Usually db.ref.supabase.co resolves to an IP. If DNS ENOTFOUND happens, it means DigitalOcean/Supabase is blocking DNS, or the reference ID "rjwaunghmcihpmockiap" is not valid for `db.`.
// Actually, `rjwaunghmcihpmockiap.supabase.co` is the REST URL. Therefore `__ref__` is `rjwaunghmcihpmockiap`.
// Could it be `.supabase.com` instead of `.supabase.co` for db? No, it's `aws-0-us-east-1.pooler.supabase.com` or similar.
