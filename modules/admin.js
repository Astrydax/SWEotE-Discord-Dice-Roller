function admin(bot, message, params, command) {
  switch (command) {
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
