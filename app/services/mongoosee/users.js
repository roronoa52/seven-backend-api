const Admins = require('../../api/v1/admin/model')
const { BadRequestError } = require('../../errors')
const { createTokenUser, createJWT } = require('../../utils');

const createUser = async (req) => {
    const { email, password, confirmPassword, name } = req.body

    if( password !== confirmPassword){
        throw new BadRequestError('Password and confirm password tidak cocok')
    }

    var result = await Admins.create({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    })

    const token = createJWT({ payload: createTokenUser(result) });

    await Admins.findOneAndUpdate(
        { _id: result.id,},
        { token},
        { new: true, runValidators: true }
    )

    delete result._doc.password
    delete result._doc.confirmPassword

    return {result, token}
}

module.exports = {
    createUser
}