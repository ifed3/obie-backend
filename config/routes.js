const StripeWebHook = require('stripe-webhook-middleware'),
    express = require('express'),
    config = require('./'),
    router = express.Router(),
    authRouter = express.Router();

// Get controllers
const authentication = require('../app/controllers/authentication'), 
    user = require('../app/controllers/user'),
    campaign = require('../app/controllers/campaign'),
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

    // Set routing for stripe subscription and webhook
    router.put('/subscription', requireAuth, customer.update_plan)
    router.post('/stripe/events', stripeWebhook.middleware, stripe_events)

    // Test route for ensuring authentication is working
    router.get('/', function(req, res) {
        res.json({ message: 'obie-api' })
    }); 
    
    // Check for unique email during registration
    router.get('/email_check', authentication.email_check);

    // Set routing for campaign calls
    router.get('/campaigns', requireAuth, campaign.index);
    router.get('/campaign', requireAuth, campaign.show);
    router.post('/campaign', requireAuth, campaign.create);
    router.put('/campaign', requireAuth, campaign.update);
    router.delete('/campaign', requireAuth, campaign.destroy);

    // Set routing for user api calls
    router.post('/device_token', requireAuth, user.device_token);

    // router.get('/users', requireAuth, authentication.roleAuth('owner'), user.index);
    // router.route('/users/:id', requireAuth)
    //     .get(user.show)
    //     .put(user.update)
    //     .delete(user.destroy); 

    // Set all routes to be prefixed with apis
    app.use(router);                         

}