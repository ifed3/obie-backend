'use strict';

const Stripe = require('stripe');
var stripe;

// Extend company schema with the following properties
module.exports = function stripeCustomer(schema, options) {
    stripe = Stripe(options.apiKey);

    // Add stripe properties to company schema
    schema.add({
        stripe: {
            customerId: String,
            subscriptionId: String,
            last4: String,
            plan: {
                type: String,
                default: options.defaultPlan
            }
        }
    });

    // Check for stripe customer id before saving the company
    schema.pre('save', function(next){
        var user = this;
        if (!user.isNew || user.stripe.customerId) return next();
        user.createCustomer(function(err){
            if (err) return next(err); // Log error
            next();
        });
    });

    // Retrieve company subscription plans
    schema.statics.getPlans = function() {
        return options.planData;
    };

    // // Set stripe id to be that of company id upon when creating new company
    schema.methods.createCustomer = function(callback) {
        var user = this;
        stripe.customers.create({
            email: user.email
        }, function(err, customer) {
            if (err) return callback(error);
            user.stripe.customerId = customer.id;
            return callback();
        });
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

        // Update card to stripe_token 
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

        if(stripe_token) {
            user.setCard(stripe_token, function(err){
                if (err) return callback(err);
                createSubscription();
            });
        } else {
            if(user.stripe.subscriptionId) {
                stripe.customers.updateSubscription(
                    user.stripe.customerId,
                    user.stripe.subscriptionId,
                    customerPlan,
                    subscriptionHandler
                )
            } else {
                createSubscription()
            }
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