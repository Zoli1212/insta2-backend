const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')


const User = mongoose.model('User')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const requireLogin = require('../middleware/requireLogin')

const { JWT_SECRET } = require('../keys')

// router.get('/protected', requireLogin, (req, res) => {

//     res.send('hello user')
// })

router.post('/signup', (req, res) => {


    const { name, email, password} = req.body
    if(!name || !email || !password) res.status(422).json({error: 'Please fill all fields'})

    User.findOne({ email}).then((savedUser) => {
        if(savedUser){

            return res.status(422).json({error: 'user already exists with this email'})



        }


        bcrypt.hash(password, 16)
        .then(hashedpassword=> {
            
            const user = new User({
                email,
                password: hashedpassword,
                name
        
            })
        
            user.save().then(user=>{
        
                res.status(201).json({message: user})
            })
            .catch(err=> {
                console.log(err)
            })
        })

    }).catch(err => console.log(err))




})

router.post('/signin', (req, res) =>{

    const {email, password } = req.body
    if(!email || !password) res.status(422).json({ error: 'please add email or password'})

    User.findOne({email}).then(savedUser => {

        if(!savedUser){
            res.status(422).json({error: "Invalid email or password "})
        }

        bcrypt.compare(password, savedUser.password ).then(doMatch => {
            if(doMatch){
                // res.status(200).json({message: 'succesfully signed'})

                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                res.json({token})
            }else{
                return res.status(422).json({error: 'Invalid email or password'})
            }
        }).catch(err => console.log(err))

    } )

})

module.exports = router