const dice = require('../').dice;
const readData = require('../').readData;

async function trigger(bot, message, type) {
	return new Promise(async resolve => {
		let characterStatus = await readData(bot, message, 'characterStatus');
		let list = [];
		if (Object.keys(characterStatus).length === 0) {
			message.channel.send("No characters found please use !char to setup").catch(console.error);
			return;
		}
		Object.keys(characterStatus).forEach(characterName => {
			if (characterStatus[characterName][type]) {
				Object.keys(characterStatus[characterName][type]).forEach(name => {
					list.push({
						name: characterName,
						[type]: name,
						value: characterStatus[characterName][type][name]
					});
				})
			}
		});
		list.sort((a, b) => a.value - b.value);
		let roll = dice(100);
		let target = 0;
		let total = 0;
		list.forEach(name => total += name.value);
		message.channel.send(`The total group ${type} is ${total}. The ${type} roll is ${roll}.`).catch(console.error);

		if (roll > total) {
			message.channel.send(`No ${type} triggered`).catch(console.error);
			resolve();
		}

		for (let i = 0; i < list.length; i++) {
			target += list[i].value;
			if (target > roll) {
				message.channel.send(`${list[i].name}'s ${list[i][type]} ${type} has been triggered.`).catch(console.error);
				break;
			}
		}
	}).catch(error => message.reply(`That's an Error! ${error}`));

}

exports.trigger = trigger;
