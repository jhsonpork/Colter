export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
}

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  proAccess: {
    priceId: 'price_1RYfLQACZYrdFwrXSy38VoEl',
    name: 'Pro Plan — NexusAI Access',
    description: 'Full access to all 80+ premium tools, including startup generators, pitch creators, product builders, and revenue boosters.',
    mode: 'subscription'
  }
};