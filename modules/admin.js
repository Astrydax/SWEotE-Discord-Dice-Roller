exports.admin = function admin(command, message, bot) {
  switch (command) {
    case "servers":
    message.author.sendMessage(`Currently on ${bot.guilds.size} servers!`);
    break;
  }
}
