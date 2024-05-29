const { UnauthenticatedError, UnauthorizedError } = require("../errors");
const { isTokenValid } = require("../utils");
const Admins = require('../api/v1/admin/model');

const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const token = authHeader.split(' ')[1];

        const payload = isTokenValid({ token });
        
        if (!payload) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        const validToken = await Admins.findOne({ token });
        
        if (!validToken) {
            throw new UnauthenticatedError('Authentication invalid');
        }

        req.user = {
            email: payload.email,
            name: payload.name,
            id: payload.userId,
        };

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authenticateUser }