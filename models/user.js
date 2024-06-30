const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    registeredDate: { type: Date, default: Date.now },
})

const bcryptjs = require('bcryptjs')

userSchema.pre('save', async function save(next) {
    const user = this       // WTF?
    if (!user.isModified('password'))
        return next()
    try {
        user.password = await bcryptjs.hash(user.password, 5)
        next()
    } catch (err) {
        next(err)
    }
})

userSchema.methods.validatePassword = function (password, done) {
    return bcryptjs.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User