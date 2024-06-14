const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../middlewares/auth');

const { User } = require('../models/user');
const userController = require('../controllers/user');


router.get('/', auth, userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/signup', userController.signup);
router.post('/login',  userController.login);
router.post('/resetPassword', userController.resetPassword);
router.patch('/update/:id', auth, userController.updateUser);
router.get('/delete/:id', auth, userController.deleteUser);

module.exports = router;