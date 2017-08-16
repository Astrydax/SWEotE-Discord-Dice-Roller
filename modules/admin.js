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
        Object.keys(characterStatus[channel]).forEach((characterName)=>{
          if (characterStatus[channel][characterName].obligation == undefined) characterStatus[channel][characterName].obligation = {};
          if (characterStatus[channel][characterName].crit == undefined) characterStatus[channel][characterName].crit = [];
        })
      })
      jsonfile.writeFile("data/characterStatus.json", characterStatus);
      break;
    case "shitlist":
      if (params[0] == "add") {
        shitList.push(params[1]);
        message.channel.sendMessage(params[1] + " added to the shit list.");
      }
      if (params[0] == "remove") {
        var index = shitList.indexOf(params[1]);
        shitList.splice(index, 1)
        message.channel.sendMessage(params[1] + " removed from the shit list.");
      }
      if (params[0] == "list") message.channel.sendMessage("The Shit List: " + shitList);
      return shitList;
      break;
    default:
      break;
  }
}

module.exports = {
    admin: admin,
};
