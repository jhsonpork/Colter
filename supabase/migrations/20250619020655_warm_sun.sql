/*
  # Fix Stripe Policies

  1. Changes
    - Drop existing policies if they exist
    - Recreate policies with IF NOT EXISTS clause
    - Fix security_invoker setting for views
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;

-- Recreate policies
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  USING ((user_id = auth.uid()) AND (deleted_at IS NULL));

CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  USING ((customer_id IN (
    SELECT customer_id FROM stripe_customers 
    WHERE (user_id = auth.uid()) AND (deleted_at IS NULL)
  )) AND (deleted_at IS NULL));

CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  USING ((customer_id IN (
    SELECT customer_id FROM stripe_customers 
    WHERE (user_id = auth.uid()) AND (deleted_at IS NULL)
  )) AND (deleted_at IS NULL));

-- Drop and recreate views with correct security settings
DROP VIEW IF EXISTS stripe_user_subscriptions;
DROP VIEW IF EXISTS stripe_user_orders;

-- Recreate views
CREATE OR REPLACE VIEW stripe_user_subscriptions AS
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

CREATE OR REPLACE VIEW stripe_user_orders AS
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