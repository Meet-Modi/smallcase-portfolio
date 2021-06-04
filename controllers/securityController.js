const express = require('express');
const path = require('path');
const SecurityModel = require('../models/security')
/*
Controller function to fetch Existing Securities
*/
const fetchAllExistingSecurities = async function(req,res){
    try{
        var data = await SecurityModel.find();
        console.log(data);
        res.status(200).send(data);
        return;
    }
    catch(err){
        res.status(500).send({message: 'fetching of securities failed.'})
        return;
    }
}
/*
Function to check if Security exists or not
*/ 
const CheckIfSecurityExists = async function(tickersymbol){
    try{
        var data = await SecurityModel.findOne({tickerSymbol : tickersymbol});
        if(data)
            return true;
        else
            return false;
    }
    catch(err){
        throw{ message: 'fetching of securities failed'}
    }
}
/*
Function to add security in the collection
*/
const add_security = async function(req,res,next){
    secData = req.body;
    try{
        const security = new SecurityModel(secData);
        console.log(security);
        await security.save();
        res.status(200).send({message : "Security added successfully!"});
    }
    catch(err){
        res.status(500).send({message : 'Security Already exists!'});
    }
}

module.exports = {
    fetchAllExistingSecurities,
    CheckIfSecurityExists,
    add_security
};