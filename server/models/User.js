import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);

// static signup method
User.signup = async function (email, password) {
  // validations
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Email is invalid');
  }
  if (validator.isStrongPassword(password, { minSymbols: 1 })) {
    throw new Error('Password is not strong enough');
  }

  const existingUser = await this.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await this.create({
    email,
    password: hashedPassword,
  });
  return user;
};

export default User;
