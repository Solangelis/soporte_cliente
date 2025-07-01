const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Counter = require('./Counter');

const userSchema = new mongoose.Schema({
  client_id: { type: Number, unique: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['admin', 'support'], default: 'support' }
}, { timestamps: true });




userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    return next(error);
  }

  next();
});

userSchema.pre('save', async function (next) {
  if (this.client_id) {
    return next();
  }

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'client_id' },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    this.client_id = counter.sequence_value;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
