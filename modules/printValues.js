
function print(str, message, bot, channelEmoji) {
  let channel = message.channel.id;
  let guild = "";

  if (channelEmoji[channel] == "swrpg") guild = bot.guilds.get('271640455714701312');
  if (channelEmoji[channel] == "genesys") guild = bot.guilds.get('329634771909083147');

  return guild.emojis.find('name', str).toString();
}

module.exports = {
    print: print,
};
