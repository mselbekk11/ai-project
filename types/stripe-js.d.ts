declare module '@stripe/stripe-js' {
  export interface Stripe {
    // Add Stripe interface definitions as needed
    redirectToCheckout(options: any): Promise<{ error?: Error }>;
    // Add other Stripe methods as needed
  }

  export function loadStripe(publishableKey: string, options?: any): Promise<Stripe | null>;
} 