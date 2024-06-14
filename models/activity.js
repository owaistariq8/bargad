const mongoose = require('mongoose');
const Joi = require('joi');

const activitySchema = new mongoose.Schema({
  name:String,
  desc:String,
  type:String,
  project:{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  startDate:Date,
  MOU:String,
  MOUSector:String,
  region:{ type: mongoose.Schema.Types.ObjectId, ref: 'Region' }, // list of regions
  district:{ type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  duration:Number, //days 
  participants:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  theme:{ type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
  skillImparted:String,
  trainers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  endDate:Date,
  report:[{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  images:[{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  mediaCoverage:String,
  mediaLinks:String,
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

const Activity = mongoose.model('Activity', activitySchema);

module.exports = {
  Activity,
};