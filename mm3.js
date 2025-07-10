const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://localhost:27017/nmydb')
  .then(() => console.log('✔ connected successfully'))
  .catch(() => console.log('❌ cannot connect'));

const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    validate: {
      validator: function(v) {
        return /^[A-Za-z].*\d$/.test(v);
      },
      message: 'Username must start with an alphabet and end with a digit.'
    }
  },
  age: {
    type: Number,
    min: 18,
    max: 65,
    required: true
  },
  dob: {
    type: Date,
    default: new Date('2016-01-01')
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\+\d{2}\d{10}$/.test(v);
      },
      message: 'Phone number must start with +, followed by 2-digit country code and 10-digit number.'
    }
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 70,
    set: v => v.toUpperCase()
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return validator.isEmail(v);
      },
      message: 'Invalid email format.'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  }
});

const User = mongoose.model('users', userSchema);

const oper = async () => {
  try {
    const userss = [{
      uname: 'ant12',
      age: 24,
      email: 'a@b.com',
      comment: "this is some line",
      role: 'customer',
      phone: '+918888899999'
    }];

    const r = [];
    r.push(await User.insertMany(userss));

    r.push(await User.updateOne({ role: 'admin' }, { $set: { uname: 'admin12' } }));

    r.push(await User.deleteOne({ age: { $lt: 20 } }));

    r.push(await User.find({}, { email: 1, comment: 1, _id: 0 }).sort({ age: -1 }).limit(1));

    r.push(await User.collection.createIndex({ role: 1 })); // createIndex instead of createIndexes

    console.log(r);
  } catch (e) {
    console.error("❌ Error during operations:", e.message);
  }
};

oper();
