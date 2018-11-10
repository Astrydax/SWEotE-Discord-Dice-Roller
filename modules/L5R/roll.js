const config = require('../../config').config;
const printEmoji = require('../').print;
const writeData = require('../').writeData;
const readData = require('../').readData;
const dice = ['white', 'black', 'success', 'opportunity', 'strife', 'explosiveSuccess'];
const rollDice = require('../').dice;
const sleep = require('../').sleep;
const asyncForEach = require('../').asyncForEach;

const diceFaces = {
	black: ['', 's', 'st', 'et', 'o', 'ot'],
	white: ['', '', 's', 's', 'so', 'st', 'st', 'e', 'et', 'o', 'o', 'o'],
	success: ['s'],
	opportunity: ['o'],
	explosiveSuccess: ['e'],
	strife: ['t']
};

async function roll(params, message, bot, desc, channelEmoji, add) {
	new Promise(async resolve => {
		let diceResult = initDiceResult();
		if (add) diceResult.roll = {...diceResult.roll, ...await readData(bot, message, 'diceResult')};
		if (!params[0] || !params.length) {
			message.reply('No dice rolled.');
			return;
		}
		//process each identifier and set it into an array
		let diceOrder = processType(params, message);
		if (!diceOrder) {
			resolve();
			return;
		}

		//rolls each die and begins rollResults
		diceOrder.forEach(color => diceResult.roll[color].push(diceFaces[color][rollDice(diceFaces[color].length) - 1]));

		//counts the symbols rolled and returns them in diceResult.results

		let messageGif, textGif = await printAnimatedEmoji(diceOrder, message, bot, channelEmoji);
		if (textGif) messageGif = await message.channel.send(textGif).catch(error => console.error(error));

		await sleep(1200);

		diceResult = countSymbols(diceResult);
		printResults(diceResult, message, bot, desc, channelEmoji, messageGif).catch(console.error);
		writeData(bot, message, 'diceResult', diceResult.roll);
		resolve()
	}).catch(error => message.reply(`That's an Error! ${error}`));

}

async function keep(params, message, bot, desc, channelEmoji, reroll) {
	new Promise(async resolve => {
			let object = {black: [], white: [], success: [], opportunity: [], strife: [], explosiveSuccess: []};
			let diceResult = initDiceResult(), keeperResults = initDiceResult(), messageGif, textGif = '';
			let roll = {...diceResult.roll, ...await readData(bot, message, 'diceResult')};
			if (!diceResult) {
				resolve();
				return;
			}
			if (params.length === 1) params = params[0].split('');

			params.forEach(target => {
				switch (true) {
					case (roll.white.length >= target):
						object.white.push(target - 1);
						break;
					case (roll.black.length + roll.white.length >= target):
						object.black.push(target - roll.white.length - 1);
						break;
					case (roll.black.length + roll.white.length + roll.success.length >= target):
						object.success.push(target - (roll.black.length + roll.white.length) - 1);
						break;
					case (roll.black.length + roll.white.length + roll.success.length + roll.opportunity.length >= target):
						object.opportunity.push(target - (roll.black.length + roll.white.length + roll.success.length) - 1);
						break;
					case (roll.black.length + roll.white.length + roll.success.length + roll.opportunity.length + roll.strife.length >= target):
						object.strife.push(target - (roll.black.length + roll.white.length + roll.success.length + roll.opportunity.length) - 1);
						break;
					case (roll.black.length + roll.white.length + roll.success.length + roll.opportunity.length + roll.strife.length + roll.explosiveSuccess.length >= target):
						object.explosiveSuccess.push(target - (roll.black.length + roll.white.length + roll.success.length + roll.opportunity.length + roll.strife.length) - 1);
						break;
				}
			});

			if (reroll) {
				keeperResults.roll = {...roll};
				await asyncForEach(Object.keys(roll).sort((a, b) => dice.indexOf(a) - dice.indexOf(b)), async color => {
					await asyncForEach(roll[color], async (face, index) => {
						if (object[color].includes(index)) {
							keeperResults.roll[color].splice(index, 1, diceFaces[color][rollDice(diceFaces[color].length) - 1]);
							if (dice.slice(0, -4).includes(color)) textGif += await printEmoji(`${color}gif`, bot, channelEmoji);
							else textGif += await printEmoji(color, bot, channelEmoji);
						}
						else {
							if (color === 'white' || color === 'black') textGif += await printEmoji(`${color}${face}`, bot, channelEmoji);
							else textGif += await printEmoji(color, bot, channelEmoji);
						}
					});
				});
				messageGif = await message.channel.send(textGif).catch(error => console.error(error));

				await sleep(1200);

			} else {
				await asyncForEach(Object.keys(roll).sort((a, b) => dice.indexOf(a) - dice.indexOf(b)), async color => {
					await asyncForEach(roll[color], async (face, index) => {
						if (object[color].includes(index)) {
							keeperResults.roll[color].push(roll[color][index]);
							textGif += await printEmoji(color, bot, channelEmoji);
						}
					});
				});
			}

			diceResult = countSymbols(keeperResults, message, bot, desc, channelEmoji);
			printResults(diceResult, message, bot, desc, channelEmoji, messageGif).catch(console.error);
			writeData(bot, message, 'diceResult', keeperResults.roll);
		}
	).catch(error => message.reply(`That's an Error! ${error}`));
}

//init diceResult
function initDiceResult() {
	return {
		roll: {
			white: [],
			black: [],
			success: [],
			opportunity: [],
			strife: [],
			explosiveSuccess: []
		},
		results: {
			face: '',
			success: 0,
			opportunity: 0,
			strife: 0,
			explosiveSuccess: {
				white: 0,
				black: 0,
			}
		}
	};
}

//processes the params and give an array of the type of dice to roll
function processType(params, message) {
	let diceOrder = [], finalOrder = [];
	if (params[0].match(/\d+/g)) {
		for (let i = 0; i < params.length; i++) {
			let diceQty = params[i].replace(/\D/g, "");
			let color = params[i].replace(/\d/g, "");
			if (diceQty > config.maxRollsPerDie) {
				message.reply('Roll exceeds max roll per die limit of ' + config.maxRollsPerDie + ' . Please try again.');
				return 0;
			}
			for (let j = 0; j < diceQty; j++) diceOrder.push(color);
		}
	} else {
		params = params.join('');
		for (let i = 0; i < params.length; i++) diceOrder.push(params[i]);
	}

	diceOrder.forEach(die => {
		switch (die) {
			case 'black':
			case 'b':
			case 'blk':
			case 'ring':
			case 'r':
				finalOrder.push('black');
				break;
			case 'white':
			case 'w':
			case 'skill':
			case 's':
				finalOrder.push('white');
				break;
			case 'success':
			case 'suc':
			case '+':
				finalOrder.push('success');
				break;
			case 'strife':
			case 'str':
			case 't':
				finalOrder.push('strife');
				break;
			case 'opportunity':
			case 'o':
				finalOrder.push('opportunity');
				break;
			case 'explosiveSuccess':
			case 'e':
			case 'exp':
				finalOrder.push('explosiveSuccess');
				break;
			default:
				break;
		}
	});
	return finalOrder;
}

function countSymbols(diceResult) {
	diceResult.results = {
		face: '',
		success: 0,
		opportunity: 0,
		strife: 0,
		explosiveSuccess: {
			white: 0,
			black: 0,
		},
	};

	Object.keys(diceResult.roll).sort((a, b) => dice.indexOf(a) - dice.indexOf(b)).forEach(color => {
		diceResult.roll[color].forEach(face => {
			for (let i = 0; face.length > i; i++) {
				switch (face[i]) {
					case 'e':
						diceResult.results.explosiveSuccess[color]++;
						diceResult.results.success++;
						break;
					case 's':
						diceResult.results.success++;
						break;
					case 'o':
						diceResult.results.opportunity++;
						break;
					case 't':
						diceResult.results.strife++;
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
	let text = '';
	diceOrder.sort((a, b) => dice.indexOf(a) - dice.indexOf(b));
	await asyncForEach(diceOrder, async die => {
		if (dice.slice(0, -4).includes(die)) text += await printEmoji(`${die}gif`, bot, channelEmoji);
		else text += await printEmoji(die, bot, channelEmoji);
	});
	if (text.length > 1500) text = 'Too many dice to display.';
	return text;
}

async function printResults(diceResult, message, bot, desc, channelEmoji, messageGif) {
	let roll = diceResult.roll, results = diceResult.results;
	await asyncForEach(Object.keys(roll).sort((a, b) => dice.indexOf(a) - dice.indexOf(b)), async color => {
		await asyncForEach(roll[color], async face => {
			if (color === 'white' || color === 'black') results.face += await printEmoji(`${color}${face}`, bot, channelEmoji);
			else results.face += await printEmoji(`${color}`, bot, channelEmoji);
		});
	});
	if (results.face.length > 1500) results.face = 'Too many dice to display.';

	let symbolOrder = ['success', 'opportunity', 'strife'];
	let response = '';
	//prints faces
	if (results.face) {
		if (messageGif) messageGif.edit(results.face).catch(error => console.error(error));
		else (message.channel.send(results.face).catch(error => console.error(error)))
	} else {
		message.reply("No dice rolled.");
		return;
	}
	if (results.explosiveSuccess.white > 0 || results.explosiveSuccess.black > 0) {
		response += await printEmoji('explosiveSuccess', bot, channelEmoji) + '(';
		await asyncForEach(Object.keys(results.explosiveSuccess), async color => {
			if (results.explosiveSuccess[color] > 0) response += await printEmoji(`${color}`, bot, channelEmoji) + results.explosiveSuccess[color] + ' ';
		});
		response += ') ';
	}
	//prints symbols
	await asyncForEach(symbolOrder, async symbol => {
		if (results[symbol] !== 0) response += await printEmoji(`${symbol}`, bot, channelEmoji) + results[symbol] + ' ';
	});
	if (results.face) message.reply(desc + " results:" + "\n\n\t" + response);
}

exports.roll = roll;
exports.keep = keep;
