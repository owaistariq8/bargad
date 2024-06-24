const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Session } = require('../models/session');
const { delay } = require('../utils/misc');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const mongoose = require('mongoose');
// Promisify bcrypt functions
const bcryptCompare = promisify(bcrypt.compare);
const bcryptHash = promisify(bcrypt.hash);


/**
 * Creates a JWT token with the provided payload.
 * @param {any} payload The data to be encoded in the token.
 * @returns {string} The generated JWT token.
 */
const createToken = (payload) => {
    return jwt.sign({ payload }, process.env.JWT_SECRET);
};


async function getUserById(req, res) {
	try {
		const userId = req.params.id;

		if(mongoose.Types.ObjectId.isValid(userId)) {
        	const user = await User.findById(userId).populate('roles');
        	if(user)
	    		res.status(200).json({ success: true, data:user });
	    	else 
	    		res.status(404).json({ success: false, data:{} });
		}
		else
	    	res.status(400).json({ success: false, message:'Invalid userId' });

    } catch (err) {
        console.log('Exception controllers/user.js => getUserById => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}


async function getUsers(req, res) {
	try {
		const query = req.query;

		if(query && typeof query == 'object') {
        	const users = await User.find(query).populate('roles');
        	if(users && Array.isArray(users) && users.length>0)
	    		res.status(200).json({ success: true, data:users });
	    	else 
	    		res.status(404).json({ success: false, data:{} });
		}
		else
	    	res.status(400).json({ success: false, message:'Invalid request' });

    } catch (err) {
        console.log('Exception controllers/user.js => getUsers => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}

async function signup(req, res) {
	try {

		if(!req.body.username) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

	 	const existingUser = await User.findOne({ username: req.body.username }).select('_id').lean();
        
        if (existingUser) 
    		return res.status(400).json({ success: false, message : 'User already exists' });
        

        const hash = await bcryptHash(req.body.password, 10);

        let user = await User.create({
        	...req.body,
        	password: hash
        })

		if(user) 
    		res.status(200).json({ success: true, data : user });
		else
	    	res.status(404).json({ success: false, message : 'Unable to create user' });

    } catch (err) {
        console.log('Exception controllers/user.js => signup => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}


async function resetPassword(req, res) {
	try {

		if(!req.body.password || !req.body.email) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

		const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.password, salt);

        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) 
        	return res.status(404).json({ success: false, message : 'User not found' });

        const currentPassword = user.password;
        const compare = promisify(bcrypt.compare);
        const result = await compare(req.body.password, currentPassword);

        if (result) 
            return res.status(400).json({ success: false, message : 'You have already used this password!' });;

        await User.updateOne({ email }, { password: newPassword });
        res.status(200).json({ success: true, message : 'Password updated successfully' });
	 	

    } catch (err) {
        console.log('Exception controllers/user.js => resetPassword => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}


async function login(req, res) {
	try {

		if(!req.body.username || !req.body.password) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

        const user = await User.findOne({ username:  req.body.username }).populate('roles').populate('customer');
        if(user) {

        	let session = await manageSession(req,user.id);
	        if (!session || !session.session || !session.session.sessionId) {
	          return res.status(500).send("Unable to Start session.");
	        }
	        else {
		        const passwordMatched = await bcryptCompare(req.body.password, user.password);
		     	if (passwordMatched){
		     		const data = {
			     		accessToken:user.accessToken,
			            userId: user.id,
			            sessionId:session.session.sessionId,
			            user: {
			              login: user.login,
			              email: user.email,
			              displayName: user.name,
			              customer: user?.customer?._id,
			              roles: user.roles,
			            }
		     		}
		            res.status(200).json({ success: true, data});
		     	}
		        else 
					return res.status(400).json({ success: false, message : 'Invalid request' });
	        }
        }
        else 
			return res.status(400).json({ success: false, message : 'Invalid request' });
    } catch (err) {
        console.log('Exception controllers/user.js => login => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}


async function manageSession(req, userId) {

  try {
    await clearUserSession(userId);

    // console.log("req.session",req.session);
    if(req.session) {

      req.session.cookie.expires = false;
      let maxAge = process.env.TOKEN_EXP_TIME || "48h";
      maxAge = maxAge.replace(/\D/g,'');

      req.session.cookie.maxAge =  maxAge * 60 * 60 * 1000;
      req.session.isLoggedIn = true;
      req.session.user = userId;
      req.session.sessionId = req.sessionID;
      
      await req.session.save();
      await delay(500);
      let user = await Session.findOne({"session.user":userId});
      return user;
    }
    else {
      console.log("session not found",new Date().getTime());

      return false;
    }


  } catch (err) {
    console.error('Error saving to session storage: ', err);
    return next(new Error('Error creating user session'));
  }
}

async function clearUserSession(userId) {
  await Session.deleteMany({"session.user":userId});
  await Session.deleteMany({"session.user":{$exists:false}});
}

async function updateUser(req, res) {
	try {

		if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

		const salt = await bcrypt.genSalt(10);
        req.body.password = await bcryptHash(req.body.password, salt);

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if(user)
            res.status(200).json({ success: true, data : user});
        else 
			return res.status(404).json({ success: false, message : 'User Not found' });
    } catch (err) {
        console.log('Exception controllers/user.js => updateUser => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}

async function deleteUser(req, res) {
	try {

		if(!mongoose.Types.ObjectId.isValid(req.params.id)) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

        const deleteResponse = await User.deleteOne({_id:req.params.id});
        if(deleteResponse)
            res.status(200).json({ success: true, data : {}});
        else 
			return res.status(404).json({ success: false, message : 'User Not found' });
    } catch (err) {
        console.log('Exception controllers/user.js => deleteUser => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
}


module.exports = {
	createToken,
	getUserById,
	getUsers,
	signup,
	resetPassword,
	login,
	updateUser,
	deleteUser
}