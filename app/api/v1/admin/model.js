const mongoose = require('mongoose')
const { model, Schema } = mongoose
const bcrypt = require('bcryptjs')

let adminSchema = Schema (
    {
        name: {
            type: String,
            required: [true, 'Nama harus diisi'],
            minlength: 3,
            maxlength: 50
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Email harus diisi']
        },
        password: {
            type: String,
            required: [true, 'Password harus diisi']
        },
        confirmPassword: {
            type: String,
            required: [true, 'Confirm Password harus diisi']
        },
        token: {
            type: String,
        },
    },
    { timestamps: true }
)

adminSchema.pre('save', async function (next){
    const User = this
    if(User.isModified('password')){
        User.password = await bcrypt.hash(User.password, 12)
    }
})

adminSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

module.exports = model('Users', adminSchema)