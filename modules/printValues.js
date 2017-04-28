function print(str, message) {
  if (message.guild.emojis.find('name', str) != null) {
    var final = message.guild.emojis.find('name', str).toString();
  } else {
    var final = str + " custom emoji not installed on this server.  Please upload.\n";
  }
  return final;
}

module.exports = {
    print: print,
};
