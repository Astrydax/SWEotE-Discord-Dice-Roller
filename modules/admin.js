const jsonfile = require('jsonfile');
var writeBotStats = require("./misc.js").writeBotStats;

function admin(command, message, bot, botStats) {
  switch (command) {
    case "stats":
      message.author.sendMessage(`Currently on ${bot.guilds.size} servers!`);
      message.author.sendMessage(`Currently assisting ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`);
      break;
    case "logout":
      bot.logout();
      break;
    case "fix":
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
