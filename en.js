const express = require('express');
const mg = require('mongoose');
const app = express();
const PORT = 5000;

// MongoDB Connection
mg.connect('mongodb://localhost:27017/edb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB database: edb');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Schema Definition
const userSchema = new mg.Schema({
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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
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

// Model Definition
const User = mg.model('User', userSchema);

app.use(express.static(__dirname,{index:'enform.html'}));
app.use(express.urlencoded({ extended: true }));

// POST route to handle form submission
app.post('/signup', async (req, res) => {
    try {
        const { uname, age, dob, phone, comment, email, role } = req.body;
        
        // Create new user with all fields
        const newUser = new User({
            uname: uname,
            age: parseInt(age),
            dob: dob || new Date('2016-01-01'),
            phone: phone,
            comment: comment,
            email: email,
            role: role || 'customer'
        });
        
        // Save user to database
        await newUser.save();
        
        res.send('User registered successfully!');
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send('Email already exists!');
        } else if (error.name === 'ValidationError') {
            res.status(400).send('Validation Error: ' + error.message);
        } else {
            console.error('Error saving user:', error);
            res.status(500).send('Error registering user');
        }
    }
});

app.listen(
    PORT,
    ()=>{
        console.log(`Server is listening at port http://localhost:${PORT}`);
    }
);

