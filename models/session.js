const mongoose = require('mongoose');
const Joi = require('joi');

const sessionSchema = new mongoose.Schema({
    expires : {type: Date},
    session : {
        cookie : {
            originalMaxAge : {type:Boolean},
            expires : {type:Date},
            secure : {type:Boolean},
            httpOnly : {type:Boolean},
            domain : {type:String},
            path : {type:String},
            sameSite : {type:Boolean}
        },
        isLoggedIn : {type:Boolean},
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        sessionId:{type:String}
    },
}, {
  toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
  toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = {
  Session,
};
