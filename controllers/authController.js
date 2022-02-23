const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');
const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

dotenv.config({ path: '../config.env' });

//get the JWT token
const getToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUserData = { ...req.body };
  //if user is not ceated by admins then exclude this fields
  //as a normal user can manipulate this data
  const excludedFields = ['role', 'accountBalance', 'createdAt'];

  //if this is regular signup then exclude the above fields
  //or if user is created by admin then bypass it
  //this is comming from createUser middleware in userRoute

  if (!req.createUserByAdmin) {
    excludedFields.forEach((el) => delete newUserData[el]);
  }

  const user = await User.create(newUserData);
  const token = getToken(user._id);
  await new Email(user).sendWelcome();
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check email and password is present
  if (!email || !password) {
    return next(new AppError(401, 'provide email and password'));
  }

  // 2) check user exist and passord is correct
  //as we mentioned select false in password we need call for it explicitly else it will not return the password filed
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, 'provide correct email and password'));
  }

  const token = getToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.logout = (req, res, next) => {
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //if token not exist
  if (!token) {
    return next(
      new AppError(401, 'You are not logged in .please login to get access')
    );
  }

  //get the payload data(id) which we have provided during token creation
  //token expiration error comes from here
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_TOKEN
  );

  //get the current user
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(401, 'The token belong to the user does not exist')
    );
  }
  //if we come up to this point .it means user is logged in correctly
  //so we are adding the the user in req

  req.user = currentUser;
  next();
});

//restrict users based on their roles

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'You are not authorized to do that'));
    }
    next();
  };