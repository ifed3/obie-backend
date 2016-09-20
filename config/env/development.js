'use strict';

// Expose

module.exports = {
    db: process.env.DEV_MONGODB,
    stripeOptions: {
        apiKey: process.env.DEV_STRIPE_KEY,
        stripePubKey: process.env.DEV_STRIPE_PUB_KEY,
        defaultPlan: 'standard',
        plans: ['standard', 'premium'],
        planData: {
            'standard': {
                name: 'Standard',
                price: 49
            },
            'premium': {
                name: 'Premium',
                price: 79
            }
        }
    }
}