const jsonfile = require('jsonfile');


function admin(command, message, bot, characterStatus, params, shitList) {
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
        if (characterStatus[channel].blankCharacter != undefined) delete characterStatus[channel].blankCharacter;
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
