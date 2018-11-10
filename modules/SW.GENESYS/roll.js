const config = require('../').config;
const diceFaces = require('./').diceFaces;
const dice = require('../').dice;
const printEmoji = require('../').print;
const writeData = require('../').writeData;
const sleep = require('../').sleep;
const order = require('./').order;
const symbols = require('./').symbols;
const asyncForEach = require('../').asyncForEach;

async function roll(bot, message, params, channelEmoji, desc, diceResult, diceOrder) {
	return new Promise(async resolve => {
		if (!diceResult) diceResult = initDiceResult();
		if (!params[0]) {
			message.reply('No dice rolled.');
			return;
		}
		//process each identifier and set it into an array
		if (!diceOrder) diceOrder = processType(message, params);
		if (!diceOrder) return;
		//rolls each die and begins rollResults
		diceOrder.forEach(die => {
			if (!diceResult.roll[die]) diceResult.roll[die] = [];
			diceResult.roll[die].push(rollDice(die))
		});

		//counts the symbols rolled
		diceResult = countSymbols(diceResult, message, bot, channelEmoji);

		writeData(bot, message, 'diceResult', diceResult.roll);

		let messageGif, textGif = await printAnimatedEmoji(diceOrder, message, bot, channelEmoji).catch(console.error);
		if (textGif) messageGif = await message.channel.send(textGif).catch(console.error);
		resolve(diceResult);

		await sleep(desc.includes('roll') ? 0 : 1000);

		printResults(diceResult, message, bot, desc, channelEmoji, messageGif).catch(console.error);
	}).catch(error => message.reply(`That's an Error! ${error}`));
}

//init diceResult
function initDiceResult() {
	return {
		roll: {
			yellow: [],
			green: [],
			blue: [],
			red: [],
			purple: [],
			black: [],
			white: [],
			success: [],
			advantage: [],
			triumph: [],
			failure: [],
			threat: [],
			despair: [],
			lightpip: [],
			darkpip: []
		},
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
function processType(message, params) {
	let diceOrder = [];
	if (params.length > 0) {
		if ((params[0]).match(/\d+/g)) {
			for (let i = 0; i < params.length; i++) {
				let diceQty = +(params[i]).replace(/\D/g, "");
				let color = params[i].replace(/\d/g, "");
				if (diceQty > +config.maxRollsPerDie) {
					message.reply('Roll exceeds max roll per die limit of ' + config.maxRollsPerDie + ' . Please try again.');
					return 0;
				}
				for (let j = 0; j < diceQty; j++) {
					diceOrder.push(color);
				}
			}
		} else {
			params = params.join('');
			for (let i = 0; i < params.length; i++) {
				diceOrder.push(params[i]);
			}
		}
	} else {
		message.reply('No dice rolled.');
		return 0;
	}

	let finalOrder = [];
	diceOrder.forEach((die) => {
		switch (die) {
			case 'yellow':
			case 'y':
			case 'proficiency':
			case 'pro':
				finalOrder.push('yellow');
				break;
			case 'green':
			case 'g':
			case 'ability':
			case 'a':
				finalOrder.push('green');
				break;
			case 'blue':
			case 'b':
			case 'boost':
			case 'boo':
				finalOrder.push('blue');
				break;
			case 'red':
			case 'r':
			case 'challenge':
			case 'c':
				finalOrder.push('red');
				break;
			case 'purple':
			case 'p':
			case 'difficulty':
			case 'd':
				finalOrder.push('purple');
				break;
			case 'black':
			case 'blk':
			case 'k':
			case 's':
			case 'sb':
			case 'setback':
				finalOrder.push('black');
				break;
			case 'white':
			case 'w':
			case 'force':
			case 'f':
				finalOrder.push('white');
				break;
			case 'success':
			case 'suc':
			case '*':
				finalOrder.push('success');
				break;
			case 'advantage':
			case 'adv':
			case 'v':
				finalOrder.push('advantage');
				break;
			case 'triumph':
			case 'tri':
			case '!':
				finalOrder.push('triumph');
				break;
			case 'failure':
			case 'fail':
			case '-':
				finalOrder.push('failure');
				break;
			case 'threat':
			case 'thr':
			case 't':
				finalOrder.push('threat');
				break;
			case 'despair':
			case 'des':
			case '$':
				finalOrder.push('despair');
				break;
			case 'lightside':
			case 'lightpip':
			case 'light':
			case 'l':
				finalOrder.push('lightpip');
				break;
			case 'darkside':
			case 'darkpip':
			case 'dark':
			case 'n':
				finalOrder.push('darkpip');
				break;
			default:
				break;
		}
	});
	return finalOrder;
}

//rolls one die and returns the results in an array
function rollDice(die) {
	//roll dice and match them to a side and add that face to the message
	if (!die) return;
	return dice(Object.keys(diceFaces[die]).length);
}

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
			for (let i=0; i<face.length; i++) {
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

async function printAnimatedEmoji(diceOrder, message, bot, channelEmoji) {
	return new Promise(async resolve => {
		let text = '';
		await asyncForEach(diceOrder.sort((a, b) => order.indexOf(a) - order.indexOf(b)), async die => {
			if (order.slice(0, -8).includes(die)) text += await printEmoji(`${die}gif`, bot, channelEmoji).catch(console.error);
			else text += await printEmoji(die, bot, channelEmoji).catch(console.error);
		});
		if (text.length > 1500) text = 'Too many dice to display.';
		resolve(text);
	});
}

async function printResults(diceResult, message, bot, desc, channelEmoji, messageGif) {
	//prints faces
	await asyncForEach(Object.keys(diceResult.roll).sort((a, b) => order.indexOf(a) - order.indexOf(b)), async color => {
		await asyncForEach(diceResult.roll[color], async number => {
			let face = diceFaces[color][number].face;
			if (symbols.includes(color)) face = '';
			diceResult.results.face += await printEmoji(`${color}${face}`, bot, channelEmoji).catch(console.error);
		});
	});

	if (diceResult.results.face.length > 1500) diceResult.results.face = 'Too many dice to display.';

	if (diceResult.results.face) {
		if (messageGif) messageGif.edit(diceResult.results.face).catch(error => console.error(error));
		else (message.channel.send(diceResult.results.face).catch(error => console.error(error)))
	} else {
		message.reply("No dice rolled.");
		return;
	}

	//creates finalCount by cancelling results
	let finalCount = {};
	if (diceResult.results.success > diceResult.results.failure) finalCount.success = diceResult.results.success - diceResult.results.failure;
	if (diceResult.results.failure > diceResult.results.success) finalCount.failure = diceResult.results.failure - diceResult.results.success;
	if (diceResult.results.advantage > diceResult.results.threat) finalCount.advantage = diceResult.results.advantage - diceResult.results.threat;
	if (diceResult.results.threat > diceResult.results.advantage) finalCount.threat = diceResult.results.threat - diceResult.results.advantage;
	if (diceResult.results.triumph > 0) finalCount.triumph = diceResult.results.triumph;
	if (diceResult.results.despair > 0) finalCount.despair = diceResult.results.despair;
	if (diceResult.results.lightpip > 0) finalCount.lightpip = diceResult.results.lightpip;
	if (diceResult.results.darkpip > 0) finalCount.darkpip = diceResult.results.darkpip;

	//prints finalCount
	let response = '';
	await asyncForEach(Object.keys(finalCount), async symbol => {
		if (finalCount[symbol] !== 0) response +=  `${await printEmoji(symbol, bot, channelEmoji)} ${finalCount[symbol]} `;
	});
	if (!response) response += 'All dice have cancelled out';
	if (diceResult.results.face) message.reply(`${desc} results:\n\n\t${response}`);
}

exports.roll = roll;
exports.processType = processType;
exports.rollDice = rollDice;
exports.countSymbols = countSymbols;
exports.printResults = printResults;

