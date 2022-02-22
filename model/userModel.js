const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An user must have name'],
  },
  email: {
    type: String,
    required: [true, 'An user must have email'],
    unique: [true, 'Email is exist already'],
    //validate
    validate: [validator.isEmail, 'Provide correct email address'],
  },
  accountBalance:{
    type:Number,
    default:100,
    min:[0,'balance cannot be negative']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide an password'],
    minlength: [6, 'minimum password length should be 6'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password and confirm password should be same',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//document middleware

userSchema.pre('save', async function (next) {
  //encrypt the password
  this.password = await bcrypt.hash(this.password, 5); //Salt length to generate
  //Delete passwordConfirm filed
  this.passwordConfirm = undefined;
  //async function we dont need next()
  // next();
});


//instance method on user collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
