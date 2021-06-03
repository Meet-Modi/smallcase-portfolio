const express = require('express');
const path = require('path');
const SecurityModel = require('../models/security')
const crypto = require('crypto')

const fetchAllExistingSecurities = async function(req,res){
    try{
        var data = await SecurityModel.find();
        console.log(data);
        res.send(data);
    }
    catch(err){
        throw { message: `fetching of securities failed.`}
    }
}

const check_if_security_exists = async function(tickersymbol){
    try{
        var data = await SecurityModel.findOne({tickerSymbol : tickersymbol});
        if(data)
            return true;
        else
            return false;
    }
    catch(err){
        throw{ message: `fetching of securities failed`}
    }
}

const add_security = async function(req,res,next){
    secData = req.body;
    //secData.securityId = crypto.randomBytes(16).toString("hex");
    try{
        const security = new SecurityModel(secData);
        console.log(security);
        await security.save();
        res.send("Security added successfully!");
    }
    catch(err){
        res.status(500).send({message : 'Already exists!'});
    }
}

module.exports = {
    fetchAllExistingSecurities,
    check_if_security_exists,
    add_security
};