const functions = require('./');
const readData = require('../').readData;
const writeData = require('../').writeData;
const _ = require('lodash');

async function char(bot, message, params, channelEmoji) {
	return new Promise(async resolve => {
		//setting the channel specific variables
		let characterStatus = await readData(bot, message, 'characterStatus');
		let characterName, character, modifier = 0, command = 'list';

		if (params[0]) command = params[0];
		if (params[1]) characterName = params[1].toUpperCase();
		if (params[2] && +params[2]) modifier = +params[2];

		if (characterName && characterStatus[characterName]) character = {...characterStatus[characterName]};
		if (!character && command !== 'list' && command !== 'reset') {
			if (command === "setup" || command === "add") {
				if (!characterName) {
					message.channel.send("No characterName, !help char for more information").catch(error => message.reply(`That's an Error! ${error}`));
					resolve();
					return;
				}
			} else {
				message.channel.send(`${characterName} has not been set up.  Please use !char setup characterName [maxWound] [maxStrain] [credits] to complete setup.`).catch(error => message.reply(`That's an Error! ${error}`));
				resolve();
				return;
			}
		}
		let text = '', name = '', type = '';
		switch (command) {
			case 'setup':
			case 'add':
				if (character) {
					text += `${characterName} already exists!`;
					break;
				}
				//init the new characters stats
				character = {
					maxWound: 0,
					maxStrain: 0,
					currentWound: 0,
					currentStrain: 0,
					credits: 0,
					crit: [],
					obligation: {},
					duty: {},
					morality: {},
				};
				if (params[2]) character.maxWound = +params[2].replace(/\D/g, "");
				if (params[3]) character.maxStrain = +params[3].replace(/\D/g, "");
				if (params[4]) character.credits = +params[4].replace(/\D/g, "");
				text += buildCharacterStatus(characterName, character);
				break;

			case 'wound':
			case 'w':
				if (modifier) {
					character.currentWound = +character.currentWound + modifier;
					if (modifier > 0) text += `${characterName} takes ${modifier} wounds`;
					if (modifier < 0) text += `${characterName} recovers from ${-modifier} wounds.`;
				}
				if (+character.currentWound < 0) character.currentWound = 0;
				if (+character.currentWound > 2 * +character.maxWound) character.currentWound = 2 * +character.maxWound;
				text += `\nWounds: \`${character.currentWound} / ${character.maxWound}\``;
				if (+character.currentWound > +character.maxWound) text += `\n${characterName} is incapacitated.`;
				break;

			case 'strain':
			case 's':
				if (modifier) {
					character.currentStrain = +character.currentStrain + modifier;
					if (modifier > 0) text += `${characterName} takes ${modifier} strain`;
					else if (modifier < 0) text += `${characterName} recovers from ${-modifier} strain.`;
				}
				if (+character.currentStrain < 0) character.currentStrain = 0;
				if (+character.currentStrain > 1 + +character.maxStrain) character.currentStrain = 1 + +character.maxStrain;
				text += `\nStrain: \`${character.currentStrain} / ${character.maxStrain}\``;
				if (+character.currentStrain > +character.maxStrain) text += `\n${characterName} is incapacitated.`;
				break;

			case 'crit':
				if (!character.crit) character.crit = [];
				if (modifier) {
					if (modifier > 0) {
						character.crit.push(modifier);
						text += `${characterName} has added Crit:${modifier} to their Critical Injuries.\n`;
					} else if (modifier < 0) {
						let index = _.indexOf(character.crit, -modifier);
						if (index > -1) {
							character.crit.splice(index, 1);
							text += `${characterName} has removed Crit:${-modifier} from their Critical Injuries.\n`;
						} else text += `${characterName} does not have Crit:${-modifier} in their Critical Injuries.\n`;
					}
				}
				if (character.crit.length > 0) {
					text += `${characterName} has the following Critical Injuries.`;
					character.crit.sort().forEach(crit => text += `\nCrit ${crit}: ${functions.textCrit(crit, channelEmoji)}`);
				} else text += `${characterName} has no Critical Injuries.`;
				break;

			case 'obligation':
			case 'o':
			case 'd':
			case 'duty':
			case 'inventory':
			case 'i':
			case 'misc':
			case 'm':
				if (command === 'o' || command === 'obligation') type = 'obligation';
				if (command === 'd' || command === 'duty') type = 'duty';
				if (command === 'i' || command === 'inventory') type = 'inventory';
				if (command === 'm' || command === 'misc') type = 'misc';
				if (!character[type]) character[type] = {};
				if (params[3]) name = params[3].toUpperCase();
				if (!name) {
					text += `No ${type} name was entered.`;
					break;
				}
				if (modifier > 0) {
					if (character[type] === '') character[type] = {};
					if (!character[type][name]) character[type][name] = 0;
					character[type][name] += modifier;
					text += `${characterName} has added ${modifier} to their ${name} ${type}, for a total of ${character[type][name]}`;
					//subtraction modifier
				} else if (modifier < 0) {
					if (!character[type][name]) text += `${characterName} does not currently have any ${name} ${type}.`;
					else {
						character[type][name] += modifier;
						if (character[type][name] <= 0) {
							text += `${characterName} has removed all of their ${name} ${type}.`;
							delete character[type][name];
						}
						text += `${characterName} has removed ${modifier} from their ${name} ${type}, for a total of ${character[type][name]}`;
					}
				}
				if (Object.keys(character[type]).length === 0) text += `\n${characterName} has no ${type}.`;
				else {
					text += `\n${characterName} has the following ${type}.`;
					Object.keys(character[type]).forEach(key => text += `\n${key}: ${character[type][key]}`);
				}
				break;

			case 'credit':
			case 'credits':
			case 'c':
				if (modifier > 0 || +character.credits >= -modifier) {
					character.credits = +character.credits + modifier;
					if (modifier > 0) text += `${characterName} gets ${modifier} credits`;
					else if (modifier < 0) text += `${characterName} pays ${-modifier} credits.`;
				} else text += `${characterName} does not have ${-modifier} credits!`;
				text += `\n${characterName} has ${character.credits} credits.`;
				break;

			case 'status':
				text += buildCharacterStatus(characterName, character);
				break;

			case 'modify':
				let stat;
				if (params[3] === "maxstrain") stat = "maxStrain";
				else if (params[3] === "maxwounds") stat = "maxWound";

				if (!stat || !modifier) {
					text += "Bad Command, !help char for more information";
					break;
				}
				character[stat] = +character[stat] + modifier;
				if (character[stat] < 0) character[stat] = 0;
				text += `${characterName}'s ${stat} is modified to ${character[stat]}`;
				break;

			case 'reset':
				text = 'Deleting all the characters.';
				characterStatus = {};
				character = {};
				break;

			case 'remove':
				character = {};
				text += `${characterName} has been removed.`;
				break;

			case 'list':
				if (Object.keys(characterStatus).length < 1) text += "No characters.";
				else Object.keys(characterStatus).forEach(name => text += `${buildCharacterStatus(name, characterStatus[name])}\n\n`);
				break;
			default:
				text += `Command:**${command}** not recognized`;

		}
		if (character) characterStatus[characterName] = {...character};
		message.channel.send(text).catch(error => message.reply(`That's an Error! ${error}`));
		writeData(bot, message, 'characterStatus', characterStatus);

	}).catch(error => message.reply(`That's an Error! ${error}`));
}

const buildCharacterStatus = (name, character) => {
	let text = `__**${name}**__`;
	if (character.maxWound > 0) text += `\nWounds: \`${character.currentWound} / ${character.maxWound}\``;
	if (character.maxStrain > 0) text += `\nStrain: \`${character.currentStrain} / ${character.maxStrain}\``;
	if (character.credits > 0) text += `\nCredits: \`${character.credits}\``;
	if (character.crit.length > 0) text += `\nCrits: \`${character.crit}\``;
	['obligation', 'duty', 'morality', 'inventory', 'misc'].forEach(type => {
		if (character[type]) {
			if (Object.keys(character[type]).length > 0) {
				text += `\n${_.upperFirst(type)}: \``;
				Object.keys(character[type]).forEach(name => {
					text += `${name}: ${character[type][name]}  `;
				});
				text += '\`';
			}
		}
	});
	if ((character.maxWound < character.currentWound && character.maxWound > 0) || (character.maxStrain < character.currentStrain && character.maxStrain)) {
		text += `\n\`INCAPACITATED\``;
	}
	return text;
};

exports.char = char;
