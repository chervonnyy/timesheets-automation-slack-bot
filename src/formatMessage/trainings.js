const blocks = require('./blocks.json');

const formatTrainingMessage = (data) => {
  const messageSections = [
    {
      ...blocks.header,
      text: {
        ...blocks.header.text,
        text: "Dear colleagues, please complete Macy's security training ASAP",
      }
    }, blocks.divider
  ];

  try {
    data.forEach(({ name, slackUsername }) => {  
      const userName = `${name || ''} <@${slackUsername}>`;
  
      messageSections.push({ 
        ...blocks.plaintTextSection,
        "text": {
          ...blocks.plaintTextSection.text, 
          "text": userName
        },
      });
    });
  } catch (error) {
    console.log('Error while formatting data', error)
  }

  return messageSections;
}

module.exports = formatTrainingMessage;
