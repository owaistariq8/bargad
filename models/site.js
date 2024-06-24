const mongoose = require('mongoose');
const Joi = require('joi');

const siteSchema = new mongoose.Schema({
    name: { type: String , required: true },
    // name of site. default will be organization name

    lat: { type: String },
    // latitude coordinates of site

    long: { type: String },
    // // longitude coordinates of site

    // primary Technical Contact for the site
    address: {
        street: { type: String },
        // street address like 117 vincent street, 5/2 grey street, etc.
        suburb: { type: String },
        // name of suburb
        city: { type: String },
        //name of city
        region: { type: String },
        //name of region, state, etc. 
        postcode: { type: String },
        // post code like 2010
        country: { type: String }
        //country code will be save here like NZ for New Zealand
    }
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }, 
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

const Site = mongoose.model('Site', siteSchema);

module.exports = {
  Site,
};
