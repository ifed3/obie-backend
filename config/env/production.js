'use strict';

// Expose

module.exports = {
    db: process.env.PROD_MONGODB,
    secret: process.env.SECRET,
    stripeOptions: {
        apiKey: process.env.PROD_STRIPE_KEY,
        stripePubKey: process.env.PROD_STRIPE_PUB_KEY,
        defaultPlan: 'premium',
        plans: ['standard', 'premium'],
        // planData: {
        //     'standard': {
        //         name: 'Standard',
        //         price: 79
        //     },
        //     'premium': {
        //         name: 'Premium',
        //         price: 129
        //     }
        // }
    }
}