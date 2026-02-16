
-- -------------------------------------------------------------------------
-- FIX: Reload Supabase Schema Cache
-- -------------------------------------------------------------------------
-- The error "Could not find the function... in the schema cache" happens
-- when Supabase's API layer (PostgREST) is holding onto an old definition
-- of the database function.
--
-- Running this command forces Supabase to refresh its cache immediately.
-- -------------------------------------------------------------------------

NOTIFY pgrst, 'reload config';
