const createError = require('http-errors')

/**
 * A middleware to make sure req.user exists.
 */
function needLogin(req, res, next) {
    if (req.isAuthenticated())
        return next()
    if (req.session)
        req.session.redirectUri = req.uri
    req.redirect('/login')
}

module.exports = { needLogin }