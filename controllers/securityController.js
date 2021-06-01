const express = require('express');
const path = require('path');
const SecurityModel = require('../models/security')


const fetchAllExistingSecurities = async function(req,res){
    console.log("in sec. controller");
    try{
        var data = await SecurityModel.find();
        console.log(data);
        res.send(data);
    }
    catch(err){
        throw { message: `fetching of securities failed.` }
    }
}

const check_if_security_exists = async function(tickerSymbol){
    try{
        var data = await SecurityModel.findOne({tickerSymbol : 'TCS'});
        console.log(data);
        if(data)
            return data;
        else
            return [];
    }
    catch(err){
        throw{ message: `fetching of securities failed`}
    }
}

const add_security = async function(secData){
    try{
        const security = new SecurityModel(secData);
        await security.save();
        res.send()
    }
    catch(err){
        res.status(500).send()
    }
}

module.exports = {
    fetchAllExistingSecurities,
    check_if_security_exists,
    add_security
};