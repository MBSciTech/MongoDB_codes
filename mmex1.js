const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/nmydb')
    .then(() => console.log('✔ Connected to MongoDB successfully'))
    .catch(err => console.log('❌ Cannot connect to MongoDB:', err));

// User Schema
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

// Routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Registration Form</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                input, select, textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 16px;
                    box-sizing: border-box;
                }
                textarea {
                    height: 100px;
                    resize: vertical;
                }
                button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    width: 100%;
                }
                button:hover {
                    background-color: #45a049;
                }
                .error {
                    color: red;
                    font-size: 14px;
                    margin-top: 5px;
                }
                .success {
                    color: green;
                    font-size: 14px;
                    margin-top: 5px;
                }
                .help-text {
                    font-size: 12px;
                    color: #666;
                    margin-top: 2px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>User Registration Form</h1>
                <form id="userForm">
                    <div class="form-group">
                        <label for="uname">Username *</label>
                        <input type="text" id="uname" name="uname" required>
                        <div class="help-text">Must start with a letter and end with a digit (3-20 characters)</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="age">Age *</label>
                        <input type="number" id="age" name="age" min="18" max="65" required>
                        <div class="help-text">Must be between 18 and 65</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="dob">Date of Birth</label>
                        <input type="date" id="dob" name="dob">
                        <div class="help-text">Defaults to 1/1/2016 if not provided</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number *</label>
                        <input type="text" id="phone" name="phone" placeholder="+918203543703" required>
                        <div class="help-text">Format: +[country code][10 digits] (e.g., +918203543703)</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="comment">Comment *</label>
                        <textarea id="comment" name="comment" required></textarea>
                        <div class="help-text">10-70 characters (will be converted to uppercase)</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" name="email" required>
                        <div class="help-text">Must be a valid email address</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="role">Role</label>
                        <select id="role" name="role">
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    
                    <button type="submit">Register User</button>
                </form>
                <div id="message"></div>
            </div>

            <script>
                document.getElementById('userForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    
                    // Convert age to number
                    data.age = parseInt(data.age);
                    
                    // Handle date of birth
                    if (data.dob) {
                        data.dob = new Date(data.dob);
                    }
                    
                    try {
                        const response = await fetch('/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                        
                        const result = await response.json();
                        
                        const messageDiv = document.getElementById('message');
                        if (response.ok) {
                            messageDiv.innerHTML = '<div class="success">User registered successfully!</div>';
                            document.getElementById('userForm').reset();
                        } else {
                            messageDiv.innerHTML = '<div class="error">Error: ' + result.error + '</div>';
                        }
                    } catch (error) {
                        document.getElementById('message').innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                    }
                });
            </script>
        </body>
        </html>
    `);
});

app.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        
        // Create new user
        const newUser = new User(userData);
        await newUser.save();
        
        res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed';
        if (error.code === 11000) {
            errorMessage = 'Email already exists';
        } else if (error.errors) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            errorMessage = validationErrors.join(', ');
        }
        
        res.status(400).json({ success: false, error: errorMessage });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 