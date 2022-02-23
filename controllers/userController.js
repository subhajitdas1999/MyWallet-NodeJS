import User from "../model/userModel";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync"

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});


export const getUser = catchAsync(async(req,res,next)=>{
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
export const createUser = (req, res,next) => {
  req.createUserByAdmin=true;
  next()
};

