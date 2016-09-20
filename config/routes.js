const StripeWebHook = require('stripe-webhook-middleware'),
    config = require('./'),
    router = require('express').Router();

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

// router.route('/customers')
//     .post(customer.create)
//     .get(customer.index)

// router.route('/customers/:customer_id')
//     .get(customer.show)
//     .post(customer.update)
//     .delete(customer.destroy)  

// router.route('/customers/:customer_id/sources')
//     .post(customer.update_source)

// router.route('/customers/:customer_id/source')
//     .post(customer.update_source)       

module.exports = router;