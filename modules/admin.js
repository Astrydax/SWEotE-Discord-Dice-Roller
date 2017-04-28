function admin(command, message, bot) {
  switch (command) {
    case "servers":
      message.author.sendMessage(`Currently on ${bot.guilds.size} servers!`);
      break;
    case "users":
      message.author.sendMessage(`Currently assisting ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} users!`);
      break;
  }
}

module.exports = {
    admin: admin,
};
