
-- Tighten orders INSERT policy
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Tighten reviews INSERT policy: require user_id = auth.uid()
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;
CREATE POLICY "Users can create reviews"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NOT NULL AND user_id = auth.uid());

-- Restrict push_subscriptions policies to authenticated role explicitly
DROP POLICY IF EXISTS "Users can manage their own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage their own push subscriptions"
ON public.push_subscriptions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Admins can manage all push subscriptions"
ON public.push_subscriptions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
