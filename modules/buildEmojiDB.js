const fs = require('fs');
const emoji = require('./printValues').print;

const l5rDice = [
		'black', 'blacks', 'blackst', 'blacket', 'blacko', 'blackot',
		'white', 'whites', 'whiteso', 'whitest', 'whitee', 'whiteet', 'whiteo',
		'success', 'opportunity', 'explosiveSuccess', 'strife', 'whiteHex',
		'blackgif', 'whitegif'
	],
	dice = [
		'yellow', 'yellows', 'yellowss', 'yellowa', 'yellowsa', 'yellowaa', 'yellowr',
		'green', 'greens', 'greenss', 'greena', 'greensa', 'greenaa',
		'blue', 'blues', 'bluesa', 'blueaa', 'bluea',
		'red', 'redf', 'redff', 'redt', 'redft', 'redtt', 'redd',
		'purple', 'purplef', 'purpleff', 'purplet', 'purplett', 'purpleft',
		'black', 'blackf', 'blackt',
		'whiten', 'whitenn', 'whitel', 'whitell',
		'success', 'advantage', 'triumph', 'failure', 'threat', 'despair', 'lightpip', 'darkpip', 'lightside', 'darkside', 'purplediamond',
		'yellowgif', 'greengif', 'bluegif', 'redgif', 'purplegif', 'blackgif', 'whitegif'
	],

	buildEmojiDB = async (bot) => {
		const swrpg = getEmoji('swrpg', bot, dice),
			genesys = getEmoji('genesys', bot, dice),
			swrpgPatreon = getEmoji('swrpgPatreon', bot, dice),
			genesysPatreon = getEmoji('genesysPatreon', bot, dice),
			l5r = getEmoji('l5r', bot, l5rDice),
			l5rPatreon = getEmoji('l5rPatreon', bot, l5rDice);
		Promise.all([swrpg, swrpgPatreon, genesys, genesysPatreon, l5r, l5rPatreon]).then(([swrpg, swrpgPatreon, genesys, genesysPatreon, l5r, l5rPatreon]) => {
			fs.writeFile(`./emoji.json`, JSON.stringify({
				swrpg,
				swrpgPatreon,
				genesys,
				genesysPatreon,
				l5r,
				l5rPatreon
			}), () => console.log('The file has been saved!'));
		});
	};

getEmoji = (type, bot, list) => {
	return new Promise(resolve => {
		const data = list.map(async key => await emoji(key, bot, type));
		Promise.all(data).then(data => resolve(data));
	})
};

exports.buildEmojiDB = buildEmojiDB;