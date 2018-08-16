const functions = require('./');
const print = require('../').print;
const readData = require('../').readData;
const writeData = require('../').writeData;

async function destiny(bot, message, params, channelEmoji) {
	return new Promise(async () => {
		let type, pointNameLight, pointNameDark;
		let destinyBalance = await readData(bot, message, 'destinyBalance');
		if (channelEmoji === 'genesys') {
			type = 'Story';
			pointNameLight = 'Player';
			pointNameDark = 'GM';
		} else {
			type = 'Destiny';
			pointNameLight = 'Lightside';
			pointNameDark = 'Darkside';
		}

		if (Object.keys(destinyBalance).length === 0) destinyBalance = initDestinyBalance();

		//!destiny commands
		switch (params[0]) {
			//Sets Destiny balance per color
			case "set":
			case "s":
				destinyBalance = initDestinyBalance();
				//check if numbers are used
				if (params.length > 1) {
					if (params[1].match(/\d+/g)) {
						for (let i = 0; i < params.length; i++) {
							let color = params[i].replace(/\d/g, "");
							let amount = params[i].replace(/\D/g, "");
							switch (color) {
								case "l":
								case "p":
									destinyBalance.light = amount;
									break;
								case "d":
								case "g":
									destinyBalance.dark = amount;
									break;
								default:
									break;
							}
						}
					} else {
						for (let i = 0; i < params[1].length; i++) {
							let color = params[1][i];
							switch (color) {
								case "l":
								case "p":
									destinyBalance.light = destinyBalance.light + 1;
									break;
								case "d":
								case "g":
									destinyBalance.dark = destinyBalance.dark + 1;
									break;
								default:
									break;
							}
						}
					}
				}
				break;

			//Reset the Destiny pool
			case "reset":
				destinyBalance = initDestinyBalance();
				message.reply(` resets the ${type} Points`);
				break;
			//Use a lightside from the Destiny pool
			case "light":
			case "l":
			case 'player':
			case 'p':
				if (destinyBalance.light <= 0) {
					message.channel.send(`No ${pointNameLight} points available, request will be ignored`);
					break;
				} else {
					destinyBalance.light--;
					destinyBalance.dark++;
					message.reply(` uses a ${pointNameLight} point`);
					break;
				}
			//Use a darkside from the Destiny pool
			case "dark":
			case "d":
			case 'gm':
			case 'g':
				if (destinyBalance.dark <= 0) {
					message.channel.send(`No ${pointNameDark} points available, request will be ignored`);
					break;
				} else {
					destinyBalance.dark--;
					destinyBalance.light++;
					message.reply(` uses a ${pointNameDark} point`);
					break;
				}
			case "roll":
			case "r":
				let destinyRoll = await functions.roll(bot, message, ["w"], channelEmoji, `${type} roll`);
				destinyBalance.light = +destinyBalance.light + +destinyRoll.results.lightpip;
				destinyBalance.dark = +destinyBalance.dark + +destinyRoll.results.darkpip;
				break;
			default:
				break;
		}
		//Prints out destiny pool to channel
		printDestinyBalance(destinyBalance, bot, channelEmoji, message, type);
		writeData(bot, message, 'destinyBalance', destinyBalance);
	}).catch(error => message.reply(`That's an Error! ${error}`));

}

function initDestinyBalance() {
	return {
		light: 0,
		dark: 0,
		face: "",
	};
}

function printDestinyBalance(destinyBalance, bot, channelEmoji, message, type) {
	destinyBalance.face = "";
	for (let i = 1; i <= destinyBalance.light; i++) destinyBalance.face += print("lightside", bot, channelEmoji);
	for (let i = 1; i <= destinyBalance.dark; i++) destinyBalance.face += print("darkside", bot, channelEmoji);
	message.channel.send(`${type} Points: `);
	if (destinyBalance.face !== "") {
		if (destinyBalance.face.length > 1500) destinyBalance.face = `Too many ${type} Points to display.`;
		message.channel.send(destinyBalance.face);
	}
}

exports.destiny = destiny;
