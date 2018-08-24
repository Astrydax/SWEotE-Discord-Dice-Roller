function help(topic, message, prefix) {
	switch (topic) {
		case `roll`:
			message.channel.send(`\`\`\`prolog
			COMMAND

${prefix}Roll DiceIdentifiers \`TEXT\`

DICE IDENTIFIERS

White/W/Skill/S = skill die
Black/B/Blk/Ring/R = ring die
ExplosiveSuccess/Exp/E = explosive success
Success/Suc/+ = success
Opportunity/O = opportunity
Strife/STR/T = strife

\`TEXT\` assigns a label to the roll. (optional)

Examples:
${prefix}roll wwwbb (must use single character identifiers)
${prefix}roll 1white 2black (must specify a number before each identifier)
\`\`\``);
			break;
		case `poly`:
			message.channel.send(`\`\`\`prolog
${prefix}Poly: rolls any combination of polyhedral dice with modifier

Examples:
${prefix}poly 1d4 2d6+1 1d100-60 \`\`\``);
			break;
		default:
			message.channel.send(`\`\`\`prolog
${prefix}SWRPG: uses swrpg dice for this channel
${prefix}GENESYS: uses genesys dice for this channel
${prefix}L5R: uses l5r dice in this channel

${prefix}Poly: rolls any combination of polyhedral dice
${prefix}Ver: displays bot version
${prefix}Prefix: changes the prefix to activate the bot (role needs to be higher than the bot)
${prefix}Help: displays help for topics

${prefix}Roll: rolls any combination of L5R dice
${prefix}Keep: ie ${prefix}keep 12 - keeps the first, second, and discards the rest of the dice
${prefix}Add: ie ${prefix}add ww - adds specified dice to previous dicepool.
${prefix}Reroll: ie ${prefix}reroll 12 - rerolls the first and second dice without modifying the rest of the dicepool

for more information or help join the FFG NDS Assistant Bot server https://discord.gg/G8au6FH\`\`\`
Role playing games by Fantasy Flight Games
Role playing games by Fantasy Flight Games 
<https://www.fantasyflightgames.com/en/products/star-wars-edge-of-the-empire>
<https://www.fantasyflightgames.com/en/products/star-wars-force-and-destiny>
<https://www.fantasyflightgames.com/en/products/star-wars-age-ofrebellion>
<https://www.fantasyflightgames.com/en/products/genesys>
<https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game>`);
			break;
	}
}

exports.help = help;
