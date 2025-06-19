/*
  # Add Stripe integration tables

  1. New Tables
    - `stripe_customers`
      - Links users to their Stripe customer IDs
    - `stripe_subscriptions`
      - Stores subscription information
    - `stripe_orders`
      - Stores one-time purchase information
  2. New Types
    - `stripe_subscription_status` enum
    - `stripe_order_status` enum
  3. Views
    - `stripe_user_subscriptions`
    - `stripe_user_orders`
  4. Security
    - Enable RLS on all tables
    - Add policies for users to view their own data
*/

-- Create enum types if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_subscription_status') THEN
        CREATE TYPE stripe_subscription_status AS ENUM (
            'not_started', 'incomplete', 'incomplete_expired', 'trialing', 
            'active', 'past_due', 'canceled', 'unpaid', 'paused'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_order_status') THEN
        CREATE TYPE stripe_order_status AS ENUM (
            'pending', 'completed', 'canceled'
        );
    END IF;
END$$;

-- Create stripe_customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_customers (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    customer_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Create unique index on user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'stripe_customers_user_id_key'
    ) THEN
        CREATE UNIQUE INDEX stripe_customers_user_id_key ON stripe_customers(user_id);
    END IF;
END$$;

-- Create stripe_subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    customer_id TEXT NOT NULL UNIQUE,
    subscription_id TEXT,
    price_id TEXT,
    current_period_start BIGINT,
    current_period_end BIGINT,
    cancel_at_period_end BOOLEAN DEFAULT false,
    payment_method_brand TEXT,
    payment_method_last4 TEXT,
    status stripe_subscription_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Create stripe_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS stripe_orders (
    id BIGSERIAL PRIMARY KEY,
    checkout_session_id TEXT NOT NULL,
    payment_intent_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    amount_subtotal BIGINT NOT NULL,
    amount_total BIGINT NOT NULL,
    currency TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    status stripe_order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- Create views for easier querying
CREATE OR REPLACE VIEW stripe_user_subscriptions AS
SELECT 
    sc.customer_id,
    ss.subscription_id,
    ss.status as subscription_status,
    ss.price_id,
    ss.current_period_start,
    ss.current_period_end,
    ss.cancel_at_period_end,
    ss.payment_method_brand,
    ss.payment_method_last4
FROM 
    stripe_customers sc
JOIN 
    stripe_subscriptions ss ON sc.customer_id = ss.customer_id
WHERE 
    sc.deleted_at IS NULL;

CREATE OR REPLACE VIEW stripe_user_orders AS
SELECT 
    sc.customer_id,
    so.id as order_id,
    so.checkout_session_id,
    so.payment_intent_id,
    so.amount_subtotal,
    so.amount_total,
    so.currency,
    so.payment_status,
    so.status as order_status,
    so.created_at as order_date
FROM 
    stripe_customers sc
JOIN 
    stripe_orders so ON sc.customer_id = so.customer_id
WHERE 
    sc.deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;

-- Create policies
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