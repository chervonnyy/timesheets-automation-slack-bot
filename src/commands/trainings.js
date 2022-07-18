const axios = require('axios');
const formatMessage = require('../formatMessage/trainings');

const trainingsCommand = app => async ({ command, ack, respond, say }) => {
  await ack();

  const username = command.user_name;

  try {
    const { data } = await axios.get(`${process.env.ENDPOINT}/trainings`, { params: { username }});

    const users = await Promise.all(data.map(async (rawUser) => {
      const { user } = await app.client.users.lookupByEmail({ email: rawUser.email });
      return await { ...rawUser, slackUsername: user.name };
    }));
  
    say({
      mrkdwn: true,
      blocks: formatMessage(users),
      text: 'Security trainings reminder',
    });

  } catch (error) {
    respond({
      response_type: 'ephemeral',
      text: error.message
    });
  }
}

module.exports = trainingsCommand;
