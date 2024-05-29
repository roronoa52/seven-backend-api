const { signin } = require('../../../services/mongoosee/auth')
const { StatusCodes } = require('http-status-codes')
const { createUser } = require('../../../services/mongoosee/users')
const { oAuth2Client } = require('../../../google/oauth2')

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
            'https://www.googleapis.com/auth/calendar'
          ];
    
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        
        console.log('Authorize this app by visiting this url:', authUrl);
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