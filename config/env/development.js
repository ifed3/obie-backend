'use strict';

// Expose

module.exports = {
    db: process.env.DEV_MONGODB,
    secret: process.env.SECRET
}

// stripeOptions: {
//     apiKey: process.env.DEV_STRIPE_KEY,
//     stripePubKey: process.env.DEV_STRIPE_PUB_KEY,
//     defaultPlan: 'premium',
//     plans: ['standard', 'premium'],
//     planData: {
//         'standard': {
//             name: 'Standard',
//             price: 79
//         },
//         'premium': {
//             name: 'Premium',
//             price: 129
//         }
//     }
// }
