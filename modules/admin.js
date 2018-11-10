const functions = require('./');

async function admin(bot, message, params, command) {
  switch (command) {
    case "logout":
      bot.logout();
      break;
    case "fix":
      break;
    case "test":
    	const msg = await functions.print('yellowr', bot, 'genesysPatreon', message);
    	message.channel.send(msg);
      break;
    default:
      break;
  }
}

exports.admin = admin;
