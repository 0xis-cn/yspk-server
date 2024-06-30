const express = require('express')
const router = express.Router()
const { needLogin } = require('../util')
const passport = require('passport')


router.get('/login', function (req, res) {
  res.locals.title = '登录'
  res.render('account/login')
})

router.delete('/login', needLogin, function (req) {
  req.logout()
})

/**
 * Traditional login. Use /login/oauth2 for it.
 */
router.post('/login', function (req, res, done) {
  passport.authenticate('local.login', function (err, user) {
    if (err)
      return done(err)
    if (!user) {
      return res.redirect('/login')
    }
    req.login(user, function (err) {
      if (err)
        return done(err)
      res.redirect(req.session.redirectUri || '/')
    })
  })(req, res, done)
})

module.exports = router