const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { parse } = require('dotenv');
const crypto = require('crypto');

let usersSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'name must be a require field'],
  },
  email: {
    type: String,
    require: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (val) {
        let reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return reg.test(val);
      },
      message: 'Please Provide valid email',
    },
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'password is required field'],
    minlegth: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'please confirm your password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'confirm password is not same as password',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

usersSchema.pre('save', async function (next) {
  //this code run when the password modified
  if (!this.isModified('password')) {
    return next();
  }

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirmation fiels: no need to save the value
  this.passwordConfirm = undefined;

  next();
});

usersSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

usersSchema.pre(/^find/, function (next) {
  this.select('-passwordChangedAt');
  next();
});

usersSchema.methods.correctPassword = async function (
  requestPassword,
  userPassword
) {
  return await bcrypt.compare(requestPassword, userPassword);
};

usersSchema.methods.checkPasswordChangedAfter = function (JWTTime) {
  if (this.passwordChangedAt) {
    let changedPasswordTime = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTTime < changedPasswordTime;
  }

  return false;
};

usersSchema.methods.getResetPwdToken = function () {
  let resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 6000;
  return resetToken;
};

module.exports = mongoose.model('Users', usersSchema);
