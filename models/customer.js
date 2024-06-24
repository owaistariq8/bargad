const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: { type: String , required: true },
    website: { type: String },
    type: { type: String },
    site: { type: mongoose.Schema.Types.ObjectId , ref: 'Site' },
    contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }, 
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = {
  Customer,
};
