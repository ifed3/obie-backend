'use strict';

const Company = require('../../app/models/company');

// Create new company
exports.create = function(req, res) {
    var company = new Company(req.body);
    company.save(function(err) {
        if (err) res.send(err);
        console.log("Company succesfully saved")
        res.json({ message: 'Company created'});
    });
}

// Show all companies
exports.index = function(req, res) {
    Company.find({}, function(err, companies) {
        if (err) res.send(err);
        res.json(companies);
    })
}

// Show specific company details
exports.show = function(req, res) {
    Company.findById(req.params.company_id, function(err, company) {
        if (err) res.send(err);
        res.json(company);
    });
}

// Update specific company details
exports.update = function(req, res) {
    Company.findById(req.params.company_id, function(err, company) {
        if (err) res.send(err);
        //Update company info here
        company.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'Company updated' });
        });
    });
}

// Delete a company from database
exports.destroy = function(req, res) {
    Company.remove({_id: req.params.company_id}, function(err, companies) {
        if (err) res.send(err);
        res.json({ message: 'Company deleted'});
    });
}