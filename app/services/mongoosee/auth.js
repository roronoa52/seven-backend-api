const Admins = require('../../api/v1/admin/model');
const Clients = require('../../api/v1/client/model');
const { BadRequestError, UnauthorizedError } = require('../../errors');
const { createTokenClient, createJWT, createTokenUser } = require('../../utils');

const signin = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await Admins.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }
  const token = createJWT({ payload: createTokenUser(result) });

  await Admins.findOneAndUpdate(
    {  email: email },
    { token },
    { new: true, runValidators: true }
  );

  return { token, name: result.name, email: result.email };
};

const signinClient = async (google) => {

  
  const result = await Clients.findOne({ email: google.email });

  if (!result) {
    await Clients.create({
      name: google.given_name,
      email: google.email
    })
  }

  const token = createJWT({ payload: createTokenClient(result) });

  await Clients.findOneAndUpdate(
    {  email: google.email },
    { token },
    { new: true, runValidators: true }
  );

  return { token, name: result.name, email: result.email };
};

module.exports = { signin, signinClient };