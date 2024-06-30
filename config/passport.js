const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id).catch(done).then(user => done(null, user))
})

passport.use('local.login', new localStrategy(function (username, password, done) {
    User.findOne({ 'username': username })
        .catch(done).then(function (user) {
            if (!user)
                return done(null, false)
            return user.validatePassword(password)
                .catch(done).then(ok => done(null, ok ? user : false))
        })
}))

passport.use('local.register', new localStrategy(function (username, password, done) {
    User.findOne({ 'username': username })
        .catch(done).then(function (user) {
            if (user)
                return done(null, false)
            user = new User({ 'username': username, 'password': password })
            return user.save()
                .catch(done).then(ok => done(null, ok ? user : false))
        })
}))

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/yspk')        // TODO: move to process.env.XXXX_URI
mongoose.Promise = global.Promise
mongoose.connection.on('connected', function () {
    console.log('Aloha, MongoDB')
})