var botStats = require("./botStats.js");
const config = require("../config.js").config;


function admin(command, message, bot, params) {
  switch (command) {
    case "stats":
      message.channel.send(`Currently on ${bot.guilds.size} servers!\nCurrently assisting ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`);
      break;
    case "logout":
      bot.logout();
      break;
    case "fix":
      break;
    case "test":
      break;
    case "botstats":
      botStats.writeBotStats(bot, params[0], (text) => {
        message.channel.send(text);
      });
      break;
    default:
      break;
  }
}

module.exports = {
    admin: admin,
};
