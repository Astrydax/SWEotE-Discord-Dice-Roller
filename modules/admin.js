const jsonfile = require('jsonfile');


function admin(command, message, bot, characterStatus) {
  switch (command) {
    case "stats":
      message.author.sendMessage(`Currently on ${bot.guilds.size} servers!`);
      message.author.sendMessage(`Currently assisting ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`);
      break;
    case "logout":
      bot.logout();
      break;
    case "fix":
      Object.keys(characterStatus).forEach((channel)=> {
        Object.keys(characterStatus[channel]).forEach((characterName)=>{
          if (characterStatus[channel][characterName].obligation == undefined) characterStatus[channel][characterName].obligation = {};
          if (characterStatus[channel][characterName].crit == undefined) characterStatus[channel][characterName].crit = [];
        })
      })
      jsonfile.writeFile("data/characterStatus.json", characterStatus);
      break;

    default:
      break;
  }
}

module.exports = {
    admin: admin,
};
