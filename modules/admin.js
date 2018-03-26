function admin(bot, message, params, command) {
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
    default:
      break;
  }
}

exports.admin = admin;
