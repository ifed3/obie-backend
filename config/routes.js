const StripeWebHook = require('stripe-webhook-middleware'),
    config = require('./'),
    router = require('express').Router();

const companies = require('../app/controllers/companies'),
    payment = require('../app/controllers/payment');    

const stripeWebjook = new StripeWebHook({
    stripeApiKey: config.stripeOptions.apiKey,
    respond: true
});

router.use(function(req, res, next) {
    console.log("New request made");
    next();
});

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

router.route('/companies/:company_id/charge')
    .get(payment.index)
    .post(customer.create)   

router.route('/companies/:company_id/charge/:charge_id')
    .get(payment.show)   

router.route('/companies/:company_id/customer')
    .get(customer.show)
    .post(customer.create)  

router.route('/companies/:company_id/customer/sources')
    .post(customer.sources)

router.route('/companies/:company_id/customer/source')
    .post(customer.source)                    

// router.route('/customers/:customer_id/sources')
//     .post(customer.update_source)

// router.route('/customers/:customer_id/source')
//     .post(customer.update_source)       

module.exports = router;