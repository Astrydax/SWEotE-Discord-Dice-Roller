const jsonfile = require('jsonfile');
var writeBotStats = require("./misc.js").writeBotStats;
const config = require("../config.json");


function admin(command, message, botStats) {
  switch (command) {
    case "stats":
      message.author.send(`Currently on ${bot.guilds.size} servers!`);
      message.author.send(`Currently assisting ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`);
      break;
    case "logout":
      bot.logout();
      break;
    case "fix":
      break;
    case "test":
      break;
    case "botstats":
      let text = writeBotStats(botStats);
      message.author.send(text);
      break;
    default:
      break;
  }
}

module.exports = {
    admin: admin,
};
