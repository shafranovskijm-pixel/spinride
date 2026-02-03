-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create a proper PERMISSIVE policy that:
-- 1. Requires user_id to be NOT NULL and match auth.uid()
-- 2. Or user is an admin
-- This prevents anonymous users from reading any orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  (user_id IS NOT NULL AND user_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);