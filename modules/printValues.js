
function print(str, message, bot) {
  let guild = bot.guilds.get('271640455714701312');
  if (message.guild.id == 329634771909083147) {
    guild = bot.guilds.get('329634771909083147');
  }
  return guild.emojis.find('name', str).toString();
}

module.exports = {
    print: print,
};
