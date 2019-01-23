const buildEmojiDB = require('./buildEmojiDB').buildEmojiDB;

const admin = (bot, message, params, command) => {
	switch (command) {
		case "logout":
			bot.logout();
			break;
		case "fix":
			break;
		case "test":
			break;
		case "build":
			buildEmojiDB(bot);
			break;
		default:
			break;
	}
};

exports.admin = admin;
