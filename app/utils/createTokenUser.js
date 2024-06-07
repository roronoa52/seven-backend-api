const createTokenUser = (user) => {
    return {
      name: user.name,
      userId: user._id,
      email: user.email,
    };
  };
  
  const createTokenClient = (user) => {
    return {
      name: user.name,
      userId: user._id,
      email: user.email,
    };
  };
  
  module.exports = { createTokenUser, createTokenClient };