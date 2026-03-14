
-- -------------------------------------------------------------------------
-- SECURITY HARDENING SCRIPT
-- -------------------------------------------------------------------------
-- This script addresses the vulnerabilities found in your security audit:
-- 1. Sets a safe SEARCH_PATH for functions (Prevents hacking standard tools)
-- 2. Revokes public INSERT access to tables (The secure RPC function handles this now)
-- -------------------------------------------------------------------------

-- FIX 1: Secure the RPC Functions with Explicit Search Path
-- (Replaces existing functions with the same logic but added security config)

create or replace function submit_lead_v2(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = public -- HACKER PREVENTION: Forces use of public schema only
as $$
declare
    new_lead_id uuid;
    _project_types text[];
begin
    -- Safe Array Parsing
    select array_agg(x) 
    into _project_types
    from jsonb_array_elements_text(payload->'project_type') t(x);

    insert into leads (
        first_name, last_name, email, phone, 
        street_address, city, postal_code,
        package_interest, project_type, approximate_size, 
        timeline, referral_source, message_content, status
    ) values (
        payload->>'first_name',
        payload->>'last_name',
        payload->>'email',
        payload->>'phone',
        payload->>'address',
        payload->>'city',
        payload->>'postal_code',
        payload->>'package_interest',
        _project_types,
        payload->>'approximate_size',
        payload->>'timeline',
        payload->>'referral_source',
        payload->>'message_content',
        'NEW'
    )
    returning id into new_lead_id;

    return new_lead_id;
end;
$$;

create or replace function link_photo_to_lead(
    p_lead_id uuid,
    p_original_path text
)
returns void
language plpgsql
security definer
set search_path = public -- HACKER PREVENTION
as $$
begin
    insert into photos (lead_id, original_path)
    values (p_lead_id, p_original_path);
end;
$$;

-- FIX 2: Remove overly permissive RLS Policies
-- Since we use the RPC function (which runs as Admin), we DON'T need public insert access anymore.

-- Drop the dangerous "Apply to everyone" policies if they exist
drop policy if exists "leads_anon_insert" on leads;
drop policy if exists "Public_Insert_Leads_2024" on leads;
drop policy if exists "photos_anon_insert" on photos;
drop policy if exists "Public_Insert_Photos_2024" on photos;

-- FIX 3: Secure Storage (Optional but Recommended)
-- The audit showed that public users can LIST files in 'raw_uploads'.
-- This implies a permissive RLS policy exists on storage.objects.
-- Uncomment the following lines to drop common default policies if you find them:
-- drop policy if exists "Give me access" on storage.objects;
-- drop policy if exists "Public Access" on storage.objects;

-- Create a restrictive policy for raw_uploads if needed (files are only linked via RPC)
-- (Note: Storage policies are complex, ensure you don't break admin/service access)


-- Reload Config to Apply
NOTIFY pgrst, 'reload config';
