const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async(req,res,next)=>{
  const user = await User.findById(req.params.id);
  if(!user){
    return next(new AppError(404,'No data found'))
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  })
})

//this is used as a middleware after that it will go to signup (see user route)
exports.createUser = (req, res,next) => {
  req.createUserByAdmin=true;
  next()
};

