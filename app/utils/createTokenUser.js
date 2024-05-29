const createTokenUser = (user) => {
    return {
      name: user.name,
      userId: user._id,
      email: user.email,
    };
  };
  
  const createTokenParticipant = (participant) => {
    return {
      lastName: participant.lastName,
      participantId: participant._id,
      firstName: participant.firstName,
      email: participant.email,
    };
  };
  
  module.exports = { createTokenUser, createTokenParticipant };