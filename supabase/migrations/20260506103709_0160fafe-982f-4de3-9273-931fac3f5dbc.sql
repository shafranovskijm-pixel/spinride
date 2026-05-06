
-- 1. Switch has_role to SECURITY INVOKER (RLS allows users to read own roles, sufficient for checks)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY INVOKER
 SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$function$;

-- 2. Generate a random cron secret and store in vault for the weekly report job
DO $$
DECLARE
  v_secret text := encode(gen_random_bytes(32), 'hex');
BEGIN
  -- Upsert vault secret
  IF EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'weekly_report_cron_secret') THEN
    UPDATE vault.secrets SET secret = v_secret WHERE name = 'weekly_report_cron_secret';
  ELSE
    PERFORM vault.create_secret(v_secret, 'weekly_report_cron_secret', 'Shared secret for weekly-report cron auth');
  END IF;
END $$;

-- 3. Reschedule cron job to send the cron secret via Authorization header
SELECT cron.unschedule('weekly-store-report');

SELECT cron.schedule(
  'weekly-store-report',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://atkgcbunyakdnkfybvvp.supabase.co/functions/v1/weekly-report',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'weekly_report_cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
