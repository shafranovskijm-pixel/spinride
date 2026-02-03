-- Fix 1: Restrict profiles table - users can only see their own profile
-- (This breaks public review author_name display, so we need a view for that)

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a restrictive policy - users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a database function to validate and create orders server-side
-- This prevents price manipulation attacks
CREATE OR REPLACE FUNCTION public.create_validated_order(
  _customer_name TEXT,
  _customer_phone TEXT,
  _customer_email TEXT,
  _delivery_method TEXT,
  _delivery_address TEXT,
  _notes TEXT,
  _cart_items JSONB
)
RETURNS TABLE(order_id UUID, order_number TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _order_id UUID;
  _order_number TEXT;
  _validated_items JSONB := '[]'::JSONB;
  _total_amount DECIMAL(10,2) := 0;
  _item JSONB;
  _product RECORD;
  _item_price DECIMAL(10,2);
BEGIN
  -- Validate input
  IF _customer_name IS NULL OR trim(_customer_name) = '' THEN
    RAISE EXCEPTION 'Customer name is required';
  END IF;
  
  IF _customer_phone IS NULL OR trim(_customer_phone) = '' THEN
    RAISE EXCEPTION 'Customer phone is required';
  END IF;
  
  IF _cart_items IS NULL OR jsonb_array_length(_cart_items) = 0 THEN
    RAISE EXCEPTION 'Cart cannot be empty';
  END IF;

  -- Validate and calculate real prices from database
  FOR _item IN SELECT * FROM jsonb_array_elements(_cart_items)
  LOOP
    -- Fetch real product data
    SELECT p.id, p.name, p.price, p.sale_price, p.in_stock, p.images
    INTO _product
    FROM public.products p
    WHERE p.id = (_item->>'product_id')::UUID;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product not found: %', _item->>'product_id';
    END IF;
    
    IF NOT _product.in_stock THEN
      RAISE EXCEPTION 'Product out of stock: %', _product.name;
    END IF;
    
    -- Validate quantity
    IF (_item->>'quantity')::INT < 1 OR (_item->>'quantity')::INT > 100 THEN
      RAISE EXCEPTION 'Invalid quantity for product: %', _product.name;
    END IF;
    
    -- Use real price from database (not client-provided)
    _item_price := COALESCE(_product.sale_price, _product.price);
    _total_amount := _total_amount + (_item_price * (_item->>'quantity')::INT);
    
    -- Build validated item
    _validated_items := _validated_items || jsonb_build_object(
      'product_id', _product.id,
      'name', _product.name,
      'price', _item_price,
      'quantity', (_item->>'quantity')::INT,
      'image', COALESCE(_product.images[1], NULL)
    );
  END LOOP;
  
  -- Insert order with validated data
  INSERT INTO public.orders (
    order_number,
    customer_name,
    customer_phone,
    customer_email,
    delivery_method,
    delivery_address,
    items,
    total_amount,
    notes,
    user_id
  )
  VALUES (
    'SR-' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    trim(_customer_name),
    trim(_customer_phone),
    NULLIF(trim(COALESCE(_customer_email, '')), ''),
    _delivery_method,
    NULLIF(trim(COALESCE(_delivery_address, '')), ''),
    _validated_items,
    _total_amount,
    NULLIF(trim(COALESCE(_notes, '')), ''),
    auth.uid()
  )
  RETURNING id, orders.order_number INTO _order_id, _order_number;
  
  RETURN QUERY SELECT _order_id, _order_number;
END;
$$;