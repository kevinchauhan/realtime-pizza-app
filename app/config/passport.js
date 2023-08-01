const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // check if email exists
        const user = await User.findOne({ email: email })
        if (!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        // checking password
        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in successfully' })
            }
            return done(null, false, { message: 'Username or Password is invalid' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })

    }))

    // storing user-id in session to know user is logged in or not 
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        // User.findById(id, (err, user) => {
        //     done(err, user)
        // })
        User.findById(id).then(user=>{
            done(null, user)
        }).catch(err=>{
            done(err, false)
        })
    })

    
}

module.exports = init