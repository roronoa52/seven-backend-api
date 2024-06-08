const { signin, signinClient } = require('../../../services/mongoosee/auth')
const { StatusCodes } = require('http-status-codes')
const { createUser, } = require('../../../services/mongoosee/users')
const { oAuth2Client } = require('../../../google/oauth2')
const { urlServer } = require('../../../config')

const signinAdmin = async (req, res, next) => {
    try {
        const result = await signin(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const signupAdmin = async (req, res, next) => {
    try {
        
        const result = await createUser(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const loginGoogle = async (req, res, next) => {
    try {
        const scopes = [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
          ];
    
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        
        res.redirect(authUrl)
    } catch (error) {
        next(error)
    }
}

const getRefreshToken = async (req, res, next) => {
    try {
        const code = req.query.code;
        
        const {tokens} = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(tokens);

        const userInfo = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        const result = await signinClient(userInfo.data)
        
        res.status(StatusCodes.OK).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

module.exports= {
    signinAdmin,
    signupAdmin,
    getRefreshToken,
    loginGoogle
}