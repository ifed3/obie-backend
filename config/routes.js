const StripeWebHook = require('stripe-webhook-middleware'),
    express = require('express'),
    config = require('./'),
    router = express.Router(),
    authRouter = express.Router();

// Get controllers
const authentication = require('../app/controllers/authentication'), 
    user = require('../app/controllers/user'),
    customer = require('../app/controllers/customer'),
    payment = require('../app/controllers/payment'),
    stripe_events = require('../app/controllers/stripe_webhooks');

// Create stripe webhook object
const stripeWebhook = new StripeWebHook({
    stripeApiKey: config.stripeOptions.apiKey,
    respond: true
});

// Role types constants
const REQUIRE_ADMIN = 'Admin',
    REQUIRE_OWNER = 'Owner',
    REQUIRE_CLIENT = 'Client',
    REQUIRE_MEMBER = 'Member';

module.exports = function(app, passport) {

    // Set strategies for passport authentication
    const requireAuth = passport.authenticate('jwt', {session: false}),
        requireLogin = passport.authenticate('local', {session: false});

    // Perform authentication
    authRouter.post('/login', requireLogin, authentication.login);
    authRouter.post('/register', authentication.register);
    router.use('/auth', authRouter);

    router.get('/', function(req, res) {
        res.json({ message: 'obie-stripe-api' })
    });

    // router.get('/', requireAuth, function(req, res) {
    //     res.json({ message: 'obie-stripe-api' })
    // });    

    // Set routing for user api calls
    router.get('/users', requireAuth, authentication.roleAuth('owner'), user.index);
    router.route('/users/:id', requireAuth)
        .get(user.show)
        .put(user.update)
        .delete(user.destroy); 

    ruoter.put('/subscription', requireAuth, customer.update_plan)

    // // Set routing for charges to a user
    // router.get('/charge', requireAuth, payment.index);
    // router.get('/charge/:charge_id', requireAuth, payment.show);  

    // /* iOS Stripe integration
    // */

    // // Retrieve customer endpoint
    // router.get('/customer', requireAuth, customer.show);
    // // Create card endpoint    
    // router.post('/customer/sources', requireAuth, customer.sources);
    // // Select card source endpoint    
    // router.post('/customer/source', requireAuth, customer.source) 

    router.post('/stripe/events', stripeWebhook.middleware, stripe_events)

    // Set all routes to be prefixed with apis
    app.use('/api', router);                         

}