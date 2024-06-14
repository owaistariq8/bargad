const mongoose = require('mongoose');
const Joi = require('joi');

const projectSchema = new mongoose.Schema({
  name:String,
  year:Number,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location:String,
  budgetPkr:Number,
  budgetEur:Number,
  budgetUsd:Number,
  beneficiaryCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  beneficiaryStatus:String,
  themes:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Theme' }],
  objectives:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Objective' }],
  activities:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
  directBeneficiaries:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  documents:[{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  images:[{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  news:[{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
  status : { 
    type: String,
    enum: ['started', 'completed', 'deleted', 'pending', 'stopped'],
    default: 'pending',
  }, // started,completed,deleted,pending,stopped
  startDate: { type: Date  },
  endDate: { type: Date },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

const Project = mongoose.model('Project', projectSchema);

module.exports = {
  Project,
};