
function print(str, message, bot, channelEmoji) {
  let channel = message.channel.id;
  let guild = "";

  if (channelEmoji[channel] == "genesys") guild = bot.guilds.get('329634771909083147');
  else guild = bot.guilds.get('271640455714701312');

  return guild.emojis.find('name', str).toString();
}

module.exports = {
    print: print,
};
