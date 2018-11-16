const {RichEmbed} = require('discord.js');

function help(topic, message, prefix) {
	const embed = new RichEmbed().setColor('ab0f1a');
	switch (topic) {
		case `roll`:
		case 'r':
			embed.setTitle('**Roll Help**')
				.setDescription(`*${prefix}roll diceIdentifiers "text"*`)
				.addField(
					`diceIdentifiers`,
					`**white/w/skill/s** = skill die
					**black/b/blk/ring/r** = ring die
					**explosiveSuccess/exp/e** = explosive success
					**success/suc/+** = success
					**opportunity/o** = opportunity
					**strife/str/t** = strife`)
				.addField('text', `assigns a label to the roll. (optional)`)
				.addField('Examples',
					`\`\`\`${prefix}roll wwbb\`\`\` (must use single character identifiers)
    				\`\`\`${prefix}roll 2skill 2ring\`\`\` (must specify a number before each identifier)`);
			break;
		case 'polyhedral':
		case 'poly':
		case 'p':
			embed.setTitle('**Polyhedral Roll Help**')
				.addField(`${prefix}poly`, 'Rolls any combination of polyhedral dice with modifier.')
				.addField(`Examples`, `\`\`\`${prefix}poly 1d4 2d6+1 1d100-60\`\`\``);
			break;
		default:
			embed.setTitle('**Help Contents**')
				.setDescription(`'${prefix}Help [topic]' for further information.`)
				.addField(`${prefix}swrpg`, 'Uses swrpg dice for this channel.')
				.addField(`${prefix}genesys`, 'Uses genesys dice for this channel.')
				.addField(`${prefix}l5r`, 'Uses l5r dice in this channel.')
				.addField(`${prefix}poly`, 'Rolls any combination of polyhedral dice.')
				.addField(`${prefix}ver`, 'Displays bot version.')
				.addField(`${prefix}prefix`, 'Changes the prefix to activate the bot (role needs to be higher than the bot).')
				.addField(`${prefix}help`, 'Displays help for topics.')
				.addField(`${prefix}roll`, 'Rolls any combination of L5R dice.')
				.addField(`${prefix}keep`, `ie ${prefix}keep 12 - keeps the first, second, and discards the rest of the dice.`)
				.addField(`${prefix}add`, `ie ${prefix}add ww - adds specified dice to previous dicepool.`)
				.addField(`${prefix}reroll`, `ie ${prefix}reroll 12 - rerolls the first and second dice without modifying the rest of the dicepool`)
				.addField('More Information', 'For more information or help join the [FFG NDS Assistant Bot server](https://discord.gg/G8au6FH)')
				.addField('Role playing games by Fantasy Flight Games', `[Edge of the Empire](https://www.fantasyflightgames.com/en/products/star-wars-edge-of-the-empire), [Force and Destiny](https://www.fantasyflightgames.com/en/products/star-wars-force-and-destiny), [Age of Rebellion](https://www.fantasyflightgames.com/en/products/star-wars-age-ofrebellion),[Genesys](https://www.fantasyflightgames.com/en/products/genesys), [Legends of the Five Rings](https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game)`);
			break;
	}
	message.channel.send({embed}).catch(console.error);

}

exports.help = help;
