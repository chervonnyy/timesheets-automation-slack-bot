const blocks = require('./blocks.json');

const formatMessage = (data) => {
  const messageSections = [blocks.header, blocks.divider]

  try {
    data.forEach(({ name, email, dates }) => {
      const getDates = (platform) => {
        return dates[platform] && dates[platform].length 
          ? `${platform.toUpperCase()}: ${dates[platform].join(', ')}` : '';
      }
    
      const slackMention = `<@${email.split('@')[0]}>`;
      const userName = `${name || ''} ${slackMention}`;
    
      const oaDates = getDates('oa') ? getDates('oa') + '.' : '';
      const ebsDates = getDates('ebs') ? getDates('ebs') + '.' : '';
    
      messageSections.push({ 
        ...blocks.plaintTextSection,
        "text": {
          ...blocks.plaintTextSection.text, 
          "text": `${userName}: ${oaDates} ${ebsDates}`
        },
      });
    });
  } catch (error) {
    console.log('Error while formatting data', error)
  }

  return messageSections;
}

module.exports = formatMessage;
