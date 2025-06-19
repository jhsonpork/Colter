/*
  # Fix Stripe Policies and Views

  1. Changes
    - Drop all existing policies for Stripe tables
    - Recreate policies with correct permissions
    - Drop and recreate views with proper security settings
    - Grant necessary permissions to authenticated users
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;

-- Recreate policies with correct permissions
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  USING (customer_id IN (
    SELECT customer_id FROM stripe_customers 
    WHERE user_id = auth.uid() AND deleted_at IS NULL
  ) AND deleted_at IS NULL);

CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  USING (customer_id IN (
    SELECT customer_id FROM stripe_customers 
    WHERE user_id = auth.uid() AND deleted_at IS NULL
  ) AND deleted_at IS NULL);

-- Drop and recreate views with correct security settings
DROP VIEW IF EXISTS stripe_user_subscriptions;
DROP VIEW IF EXISTS stripe_user_orders;

-- Recreate views with security_definer to ensure they work properly
CREATE OR REPLACE VIEW stripe_user_subscriptions WITH (security_definer = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL;

CREATE OR REPLACE VIEW stripe_user_orders WITH (security_definer = true) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE c.user_id = auth.uid()
AND c.deleted_at IS NULL;

-- Grant permissions to views
GRANT SELECT ON stripe_user_subscriptions TO authenticated;
GRANT SELECT ON stripe_user_orders TO authenticated;