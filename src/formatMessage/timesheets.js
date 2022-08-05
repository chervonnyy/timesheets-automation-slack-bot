const blocks = require('./blocks.json');
const groupDates = require('../utils/groupDates');

const formatTimesheetsMessage = (data, showHeader) => {
  const projectName = data[0].project || "Macy's"
  const messageSections = showHeader ? [
    {
      ...blocks.header,
      text: {
        ...blocks.header.text,
        text: "Dear colleagues, please submit the missing timesheets in EBS and OA",
      }
    }, 
    blocks.divider,
    {
      ...blocks.section,
      "text": {
        ...blocks.section.text, 
        "text": `*${projectName}*`,
      },
    },
  ] : [
    {
      ...blocks.section,
      "text": {
        ...blocks.section.text, 
        "text": `*${projectName}*`,
      },
    }
  ];

  try {
    const getDates = (platform, dates) => {
      return dates[platform] && dates[platform].length 
        ? `*${platform.toUpperCase()}*: ${groupDates(dates[platform])}.` : '';
    }

    const message = data.reduce((acc, user) => {
      const { name, slackUsername, dates, email } = user;
      const userName = slackUsername ? `${name} <@${slackUsername}>` : `${name} @${email.split('@')[0]}`;
      return acc + `${userName} ${getDates('oa', dates)} ${getDates('ebs', dates)} \n`
    }, '');

    messageSections.push({ 
      ...blocks.section,
      "text": {
        ...blocks.section.text, 
        "text": message,
      },
    });

    const managers = data.reduce((acc, user) => {
      const manager = user.manager.email && `@${user.manager.email.split('@')[0]}`;
      return manager && !acc.includes(manager) ? [...acc, manager] : acc;
    }, []);

    messageSections.push({ 
      ...blocks.section,
      "text": {
        ...blocks.section.text, 
        "text": `cc ${managers.join(' ')}`,
      },
    });

  } catch (error) {
    console.log('Error while formatting data', error)
  }

  return messageSections;
}

module.exports = formatTimesheetsMessage;
