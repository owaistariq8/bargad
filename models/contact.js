const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
  title:String,
  firstName:String,
  lastName:String,
  designation:String,
  organization:String,
  category:String,
  relationWithBargad:String,
  streetAddress:String,
  unionCouncil:String,
  city:String,
  province:{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  district:{ type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  contact:String,
  fax:String,
  email:String,
  phone: { type: String },
  status : { 
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active',
  }, // active,deleted
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = {
  Contact,
};