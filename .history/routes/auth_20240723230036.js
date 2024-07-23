const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// const bcrypt = require('b')

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body,username)
    
    try {
        const script = 2;
        // 1 :  operator injection 
        // 2 :  syntax injection 
        // 3 :  hybrid 
        let query
        if(script == 1){
          query = {
            "username" :  username,
            "password" :  password
          }
        } else if (script == 2){
            query = {
                $where: `this.username == '${username}' &&  this.password == '${password}'`
            }
        }else  {
             query = req.body
        }
        const db = mongoose.connection; 
        const user = await db.collection('User').findOne(query);
        console.log(user)

        if (!user) {
            return res.status(400).json({ msg: 'Invalid username or password' });
        }

        // const isMatch = password === user.password
        // console.log(isMatch)
        // if (!isMatch) {
        //     return res.status(400).json({ msg: 'Invalid username or password' });
        // }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
