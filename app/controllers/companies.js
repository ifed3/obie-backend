'use strict';

const mongoose = require('mongoose'),
    Company = require('../../app/models/company');

exports.create = function(req, res) {
    var company = new Company(req.body);
    company.save(function(err) {
        if (err) res.send(err);
        res.json({ message: 'Company created'});
    });
}

exports.index = function(req, res) {
    Company.find(function(err, companies) {
        if (err) res.send(err);
        res.json(companies);
    })
}

exports.show = function(req, res) {
    Company.findById(req.params.company_id, function(err, company) {
        if (err) res.send(err);
        res.json(company);
    });
}

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

exports.destroy = function(req, res) {
    Company.remove({_id: req.params.company_id}, function(err, companies) {
        if (err) res.send(err);
        res.json({ message: 'Company deleted'});
    });
}