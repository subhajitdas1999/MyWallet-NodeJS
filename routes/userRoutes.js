const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router();

//---------------Authentication Part------------------------
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/logout', authController.logout);
//---------------------------------------------------------

//All below routes needs user to be logged in
userRouter.use(authController.protect);

//only admin can access this routes
userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser, authController.signup);

userRouter.get('/:id', userController.getUser);

module.exports = userRouter;
