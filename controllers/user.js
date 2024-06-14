const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
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

		if(!req.body.userName) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

	 	const existingUser = await User.findOne({ userName: req.body.userName }).select('_id').lean();
        
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

		if(!req.body.userName || !req.body.password) 
			return res.status(400).json({ success: false, message : 'Invalid request' });

        const user = await User.findOne({ userName:  req.body.userName }).populate('roles');
        if(user) {

	        const passwordMatched = await bcryptCompare(req.body.password, user.password);
	     	if (passwordMatched)
	            res.status(200).json({ success: true, data : user});
	        else 
				return res.status(400).json({ success: false, message : 'Invalid request' });
        }
        else 
			return res.status(400).json({ success: false, message : 'Invalid request' });
    } catch (err) {
        console.log('Exception controllers/user.js => login => ', err);
    	res.status(500).json({ success: false, message:'Internal Server Error' });
    }
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