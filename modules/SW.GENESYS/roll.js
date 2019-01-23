const config = require('../').config;
const diceFaces = require('./').diceFaces;
const dice = require('../').dice;
const emoji = require('../').emoji;
const writeData = require('../').writeData;
const sleep = require('../').sleep;
const order = require('./').order;
const symbols = require('./').symbols;
const _ = require('lodash');
const finalText = (text) => text.length > 1500 ? 'Too many dice to display.' : text;

const roll = async (bot, message, params, channelEmoji, desc, diceResult, diceOrder) => {
	return new Promise(async resolve => {
		if (!diceResult) diceResult = initDiceResult();
		if (!params[0]) {
			message.reply('No dice rolled.');
			return;
		}
		//process each identifier and set it into an array
		if (!diceOrder) diceOrder = processType(message, params);

		//rolls each die and begins rollResults
		diceOrder.forEach(die => {
			if (!diceResult.roll[die]) {
				diceResult.roll[die] = [...Array(diceOrder.filter(x => x === die).length)].map(() => rollDice(die))
			}
		});

		//counts the symbols rolled
		diceResult = countSymbols(diceResult, message, channelEmoji);

		writeData(bot, message, 'diceResult', diceResult.roll);

		let messageGif, textGif = printAnimatedEmoji(diceOrder, message, channelEmoji);
		if (textGif) messageGif = await message.channel.send(finalText(textGif)).catch(console.error);
		resolve(diceResult);

		await sleep(desc.includes('roll') ? 0 : 1000);

		printResults(diceResult, message, desc, channelEmoji, messageGif);
	}).catch(error => message.reply(`That's an Error! ${error}`));
};

//init diceResult
function initDiceResult() {
	return {
		roll: {},
		results: {
			face: '',
			success: 0,
			advantage: 0,
			triumph: 0,
			failure: 0,
			threat: 0,
			despair: 0,
			lightpip: 0,
			darkpip: 0
		}
	};
}

//processes the params and give an array of the type of dice to roll
const processType = (message, params) => {
	if (0 >= params.length) {
		message.reply('No dice rolled.');
		return [];
	}
	if (params.some(param => +(param).replace(/\D/g, "") > +config.maxRollsPerDie)) {
		message.reply('Roll exceeds max roll per die limit of ' + config.maxRollsPerDie + ' . Please try again.');
		return [];
	}

	const diceOrder = (params) => {
		if (params[0].match(/\d+/g)) {
			return _.flatten(params.map(param => {
				const diceQty = +(param).replace(/\D/g, ""), color = param.replace(/\d/g, "");
				return [...Array(diceQty)].map(() => color);
			}));
		} else return params.join('').split('').map(type => type);
	};

	return diceOrder(params).map(die => {
		switch (die) {
			case 'yellow':
			case 'y':
			case 'proficiency':
			case 'pro':
				return 'yellow';
			case 'green':
			case 'g':
			case 'ability':
			case 'a':
				return 'green';
			case 'blue':
			case 'b':
			case 'boost':
			case 'boo':
				return 'blue';
			case 'red':
			case 'r':
			case 'challenge':
			case 'c':
				return 'red';
			case 'purple':
			case 'p':
			case 'difficulty':
			case 'd':
				return 'purple';
			case 'black':
			case 'blk':
			case 'k':
			case 's':
			case 'sb':
			case 'setback':
				return 'black';
			case 'white':
			case 'w':
			case 'force':
			case 'f':
				return 'white';
			case 'success':
			case 'suc':
			case '*':
				return 'success';
			case 'advantage':
			case 'adv':
			case 'v':
				return 'advantage';
			case 'triumph':
			case 'tri':
			case '!':
				return 'triumph';
			case 'failure':
			case 'fail':
			case '-':
				return 'failure';
			case 'threat':
			case 'thr':
			case 't':
				return 'threat';
			case 'despair':
			case 'des':
			case '$':
				return 'despair';
			case 'lightside':
			case 'lightpip':
			case 'light':
			case 'l':
				return 'lightpip';
			case 'darkside':
			case 'darkpip':
			case 'dark':
			case 'n':
				return 'darkpip';
			default:
				return;
		}
	}).filter(Boolean).sort();
};

//rolls one die and returns the results in an array
const rollDice = (die) => {
	//roll dice and match them to a side and add that face to the message
	if (!die) return;
	return dice(Object.keys(diceFaces[die]).length);
};

function countSymbols(diceResult) {
	diceResult.results = {
		face: '',
		success: 0,
		advantage: 0,
		triumph: 0,
		failure: 0,
		threat: 0,
		despair: 0,
		lightpip: 0,
		darkpip: 0
	};
	Object.keys(diceResult.roll).sort((a, b) => order.indexOf(a) - order.indexOf(b)).forEach(color => {
		diceResult.roll[color].forEach(number => {
			let face = diceFaces[color][number].face;
			for (let i = 0; i < face.length; i++) {
				switch (face[i]) {
					case 's':
						diceResult.results.success++;
						break;
					case 'a':
						diceResult.results.advantage++;
						break;
					case 'r':
						diceResult.results.triumph++;
						diceResult.results.success++;
						break;
					case 'f':
						diceResult.results.failure++;
						break;
					case 't':
						diceResult.results.threat++;
						break;
					case 'd':
						diceResult.results.despair++;
						diceResult.results.failure++;
						break;
					case 'l':
						diceResult.results.lightpip++;
						break;
					case 'n':
						diceResult.results.darkpip++;
						break;
					default:
						break;
				}
			}
		});
	});
	return diceResult;
}

const printAnimatedEmoji = (diceOrder, message, channelEmoji) => {
	const text = diceOrder
		.sort((a, b) => order.indexOf(a) - order.indexOf(b))
		.map(die => {
			if (order.slice(0, -8).includes(die)) return emoji(`${die}gif`, channelEmoji);
			return emoji(die, channelEmoji);
		});
	if (text.length > 1500) return 'Too many dice to display.';
	else return text.join('');
};

const printResults = ({roll, results}, message, desc, channelEmoji, messageGif) => {

	//creates finalCount by cancelling results
	let finalCount = {};
	if (results.success > results.failure) finalCount.success = results.success - results.failure;
	if (results.failure > results.success) finalCount.failure = results.failure - results.success;
	if (results.advantage > results.threat) finalCount.advantage = results.advantage - results.threat;
	if (results.threat > results.advantage) finalCount.threat = results.threat - results.advantage;
	if (results.triumph > 0) finalCount.triumph = results.triumph;
	if (results.despair > 0) finalCount.despair = results.despair;
	if (results.lightpip > 0) finalCount.lightpip = results.lightpip;
	if (results.darkpip > 0) finalCount.darkpip = results.darkpip;

	//prints faces
	const colors = Object.entries(roll).sort(([a,], [b,]) => order.indexOf(a) - order.indexOf(b)).filter(([color, numbers]) => numbers.length > 0),
		facesList = _.flatten(colors.map(([color, numbers]) => numbers.map(number => `${color}${symbols.includes(color) ? '' : diceFaces[color][number].face}`))),
		faces = facesList.map(str => emoji(str, channelEmoji)).join(''),
		response = Object.keys(finalCount).map(symbol => `${emoji(symbol, channelEmoji)} ${finalCount[symbol]}`).join('');

	if (0 >= faces.length) {
		message.reply("No dice rolled.");
		return;
	}
	if (messageGif) messageGif.edit(finalText(faces)).catch(console.error);
	else message.channel.send(finalText(faces)).catch(console.error);

	if (faces) message.reply(`${desc} results:\n\n\t${response.length > 0 ? response : 'All dice have cancelled out'}`);
};

exports.roll = roll;
exports.processType = processType;
exports.rollDice = rollDice;
exports.countSymbols = countSymbols;
exports.printResults = printResults;

