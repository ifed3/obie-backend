'use strict';

const Stripe = require('stripe');

// Extend company schema with the following properties
module.exports = function stripeCustomer(schema, options) {
    const stripe = Stripe(options.apiKey);

    // Add stripe properties to company schema
    schema.add({
        stripe: {
            token: String,
            customerId: String,
            subscriptionId: String,
            last4: String,
            plan: {
                type: String,
                default: options.defaultPlan
            }
        }
    });

    // Create stripe Customer object before saving company to db
    schema.pre('save', function(next){
        var user = this;
        if (!user.isNew || user.stripe.customerId) return next();
        user.createCustomer(function(err){
            if (err) return next(err);
            next();
        });
    });

    // Create stripe Customer object and set company's customer id 
    schema.methods.createCustomer = function(callback) {
        var user = this;
        stripe.customers.create({
            email: user.email
        }, function(err, customer) {
            if (err) return callback(err);
            user.stripe.customerId = customer.id;
            return callback();
        });
    };

    // Retrieve company subscription plans
    schema.statics.getPlans = function() {
        return options.planData;
    };

    schema.methods.setCard = function(stripe_token, callback) {
        var user = this;
        // Use cardhandler to update last 4 digits of current company card
        var cardHandler = function(err, customer) {
            if (err) return callback(err);
            if (!user.stripe.customerId) {
                user.stripe.customerId = customer.id;
            }
            // Get first card or payment source
            var card = customer.cards ? customer.cards.data[0] : customer.sources.data[0];
            // Get last 4 digits of card and update in db
            user.stripe.last4 = card.last4;
            user.save(function(err) {
                if (err) return callback(error);
                return callback(null);
            });
        };

        // Create stripe customer if non-existent
        if(!user.stripe.customerId) {
            stripe.customers.create({
                email: user.email,
                card: stripe_token
            }, cardHandler);
        } else {
            stripe.customers.update(user.stripe.customerId, {card: stripe_token}, cardHandler);
        }
    };

    schema.methods.setPlan = function(plan, stripe_token, callback) {
        var user = this,
            customerPlan = {
                plan: plan
            };

        var subscriptionHandler = function(err, subscription) {
            if (err) return callback(err);
            user.stripe.plan = plan;
            user.stripe.subscriptionId = subscription.id;
            user.save(function(err) {
                if (err) return callback(err);
                return callback(null);
            });    
        };
        
        var createSubscription = function() {
            stripe.customers.createSubscription(
                user.stripe.customerId,
                customerPlan,
                subscriptionHandler
            );
        };

        if(user.stripe.subscriptionId) { // Customer already is subscribed to a plan so update plan
            stripe.customers.updateSubscription(
                user.stripe.customerId,
                user.stripe.subscriptionId,
                customerPlan,
                subscriptionHandler
            )
        } else if (stripe_token) { // Customer has card so subscribe to plan and charge
            user.setCard(stripe_token, function(err){
                if (err) return callback(err);
                createSubscription();
            });
        } else { // Customer has no card yet, but still susbcribe to plan
            createSubscription()
        }
    };

    schema.methods.updateStripeEmail = function(callback) {
        var user = this;
        if(!user.stripe.customerId) return callback();
        stripe.customers.update(user.stripe.customerId, {email: user.email},
            function(err, customer) {
                callback(err);
            });
    };

    schema.methods.cancelStripe = function(callback) {
        var user = this;
        if(user.stripe.customerId) {
            stripe.customers.del(user.stripe.customerId)
                .then(function(confirmation) {
                    callback();
                }, function(err) {
                    return callback(err);
                });
        } else {
            callback();
        }
    };
};