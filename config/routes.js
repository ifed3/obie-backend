const StripeWebHook = require('stripe-webhook-middleware'),
    config = require('./'),
    router = require('express').Router();

const authentication = require('../app/controllers/authentication'), 
    companies = require('../app/controllers/companies'),
    customer = require('../app/controllers/customer'),
    payment = require('../app/controllers/payment');    

const stripeWebjook = new StripeWebHook({
    stripeApiKey: config.stripeOptions.apiKey,
    respond: true
});

router.use(function(req, res, next) {
    console.log("New request made");
    next();
});

// Perform authentication
router.route('/authenticate')
    .post(authentication.create)

router.get('/', function(req, res) {
    res.json({ message: 'obie-stripe-api' })
})

// Set routing for company api calls
router.route('/companies')
    .post(companies.create)
    .get(companies.index)
router.route('/companies/:company_id')
    .get(companies.show)
    .post(companies.update)
    .delete(companies.destroy)  

// Set routing for charges to a company
router.route('/companies/:company_id/charge')
    .get(payment.index)
router.route('/companies/:company_id/charge/:charge_id')
    .get(payment.show)   

// iOS Stripe integration

// Retrieve customer endpoint
router.route('/companies/:company_id/customer')
    .get(customer.show)

// Create card endpoint    
router.route('/companies/:company_id/customer/sources')
    .post(customer.sources)

// Select card source endpoint    
router.route('/companies/:company_id/customer/source')
    .post(customer.source)                    

module.exports = router;