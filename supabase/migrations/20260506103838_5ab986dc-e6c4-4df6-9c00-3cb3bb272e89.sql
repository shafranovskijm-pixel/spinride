
CREATE OR REPLACE FUNCTION public.verify_weekly_report_secret(_secret text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public, vault
AS $$
  SELECT EXISTS (
    SELECT 1 FROM vault.decrypted_secrets
    WHERE name = 'weekly_report_cron_secret'
      AND decrypted_secret = _secret
  );
$$;

REVOKE EXECUTE ON FUNCTION public.verify_weekly_report_secret(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_weekly_report_secret(text) TO service_role;
