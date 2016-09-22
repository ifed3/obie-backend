'use strict';

// Expose

module.exports = {
    db: process.env.PROD_MONGODB,
    secret: process.env.SECRET,
    stripeOptions: {
        apiKey: process.env.PROD_STRIPE_KEY,
        stripePubKey: process.env.PROD_STRIPE_PUB_KEY,
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