const updateUsers = async (users, app) => await Promise.all(users.map(async (rawUser) => {
  try {
    const { user } = await app.client.users.lookupByEmail({ email: rawUser.email });
    return { ...rawUser, slackUsername: user.name };
  } catch(error) {
    return rawUser;
  }
}));

module.exports = updateUsers;
