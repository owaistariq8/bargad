const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const auth = require('../middlewares/auth');

const { User } = require('../models/user');
const { getUsers, getUserById, signup, login, resetPassword, updateUser, deleteUser } = require('../controllers/user');


router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.post('/signup', signup);
router.post('/login',  login);
router.post('/resetPassword', resetPassword);
router.patch('/update/:id', auth, updateUser);
router.get('/delete/:id', auth, deleteUser);

module.exports = router;