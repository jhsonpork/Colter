// Stripe product configuration
export const stripeProducts = {
  proSubscription: {
    priceId: 'price_1RYfLQACZYrdFwrXSy38VoEl', // Replace with your actual Stripe price ID
    name: 'Pro Plan — NexusAI Access',
    description: 'Full access to all 80+ premium tools, including startup generators, pitch creators, product builders, and revenue boosters.',
    mode: 'subscription' as const
  }
};

// Default success and cancel URLs
export const successUrl = `${window.location.origin}/?success=true`;
export const cancelUrl = `${window.location.origin}/?canceled=true`;