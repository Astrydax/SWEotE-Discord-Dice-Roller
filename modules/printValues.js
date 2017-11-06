const config = require("../config.js").config;

function print(str, message, bot, channelEmoji) {
  let channel = message.channel.id;
  let guild = "";

  if (channelEmoji[channel] == "genesys") guild = bot.guilds.get(config.genesys);
  else guild = bot.guilds.get(config.swrpg);

  return guild.emojis.find('name', str).toString();
}

module.exports = {
    print: print,
};
