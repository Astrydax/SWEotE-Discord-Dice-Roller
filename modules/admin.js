function admin(command, message, bot) {
  switch (command) {
    case "stats":
      message.author.sendMessage(`Currently on ${bot.guilds.size} servers!`);
      message.author.sendMessage(`Currently assisting ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`);
      break;
    case "logout":
      bot.logout();
      break;
    default:
      break;
  }
}

module.exports = {
    admin: admin,
};
