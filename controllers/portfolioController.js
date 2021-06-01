const PortfolioModel = require('../models/portfolio');

async function fetchcurrent(){
    try{
        var data = await PortfolioModel.find({});
        console.log(data);
        return data;
    }
    catch(err){
        throw { message: `fetching of portfolio failed.` }
    }
}

module.exports = {
    fetchcurrent
};