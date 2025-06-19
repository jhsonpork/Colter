// Follow Supabase Edge Function format
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import Stripe from 'npm:stripe@14.18.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response(JSON.stringify({ error: 'No signature provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Handle subscription
        if (session.mode === 'subscription') {
          await handleSubscriptionCheckout(session);
        } 
        // Handle one-time payment
        else if (session.mode === 'payment') {
          await handleOneTimePayment(session);
        }
        break;
      }
      
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await updateSubscription(subscription);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleSubscriptionCheckout(session: any) {
  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  
  // Update or insert subscription in database
  const { data: existingSubscription } = await supabase
    .from('stripe_subscriptions')
    .select('*')
    .eq('customer_id', session.customer)
    .single();
  
  const subscriptionData = {
    customer_id: session.customer,
    subscription_id: subscription.id,
    price_id: subscription.items.data[0].price.id,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    cancel_at_period_end: subscription.cancel_at_period_end,
    status: subscription.status,
  };
  
  if (existingSubscription) {
    await supabase
      .from('stripe_subscriptions')
      .update(subscriptionData)
      .eq('customer_id', session.customer);
  } else {
    await supabase
      .from('stripe_subscriptions')
      .insert(subscriptionData);
  }
}

async function handleOneTimePayment(session: any) {
  // Get payment intent details
  const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
  
  // Insert order in database
  await supabase
    .from('stripe_orders')
    .insert({
      checkout_session_id: session.id,
      payment_intent_id: paymentIntent.id,
      customer_id: session.customer,
      amount_subtotal: session.amount_subtotal,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      status: 'completed',
    });
}

async function updateSubscription(subscription: any) {
  // Get payment method if available
  let paymentMethodBrand = null;
  let paymentMethodLast4 = null;
  
  if (subscription.default_payment_method) {
    const paymentMethod = await stripe.paymentMethods.retrieve(
      subscription.default_payment_method as string
    );
    paymentMethodBrand = paymentMethod.card?.brand;
    paymentMethodLast4 = paymentMethod.card?.last4;
  }
  
  // Update subscription in database
  await supabase
    .from('stripe_subscriptions')
    .update({
      subscription_id: subscription.id,
      price_id: subscription.items.data[0].price.id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_method_brand: paymentMethodBrand,
      payment_method_last4: paymentMethodLast4,
      status: subscription.status,
      updated_at: new Date().toISOString(),
    })
    .eq('customer_id', subscription.customer);
}