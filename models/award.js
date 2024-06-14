const mongoose = require('mongoose');
const Joi = require('joi');

const awardSchema = new mongoose.Schema({
  name:String,
  awardToBargad:String,
  awardBy:String,
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

const Award = mongoose.model('Award', awardSchema);

module.exports = {
  Award,
};