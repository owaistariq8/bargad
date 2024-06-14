const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: String,
  type: String,
  designation: String,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  businessPhoneNo : String,
  faxNumber : String,
  postalAddress : String,
  district : { type: mongoose.Schema.Types.ObjectId, ref: 'District' },
  province : { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  dob : Date,
  placeOfBirth : String,
  mobilePhoneNo : String,
  empId : Number,
  occupation : String,
  employer : String,
  zipCode : String,
  cnic : { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  cv : { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  image : { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  documents : [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }],
  religion : { 
    type: String,
    enum: ['muslim', 'cristian', 'hindu', 'sikh','other'],
    default: 'muslim',
  }, // Muslim,Cristian,Hindu,Sikh
  gender : { 
    type: String,
    enum: ['male', 'female', 'transgender', 'other'],
    default: 'male',
  }, // Male, Female, Transgender, other
  status : { 
    type: String,
    enum: ['active', 'inactive', 'deletion-pending', 'deleted'],
    default: 'active',
  }, // active,deleted
  accessToken: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    unique: true
  },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
};