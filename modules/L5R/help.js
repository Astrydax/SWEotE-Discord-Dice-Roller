function help(params, message) {
	let topic = params[0];
	switch (topic) {
		case `roll`:
			message.channel.send(`\`\`\`prolog
			COMMAND

!Roll DiceIdentifiers \`TEXT\`

DICE IDENTIFIERS

White/W/Skill/S = skill die
Black/B/Blk/Ring/R = ring die
ExplosiveSuccess/Exp/E = explosive success
Success/Suc/+ = success
Opportunity/O = opportunity
Strife/STR/T = strife

\`TEXT\` assigns a label to the roll. (optional)

Examples:
!roll wwwbb (must use single character identifiers)
!roll 1white 2black (must specify a number before each identifier)
\`\`\``);
			break;
		case `poly`:
			message.channel.send(`\`\`\`prolog
!Poly: rolls any combination of polyhedral dice with modifier

Examples:
!poly 1d4 2d6+1 1d100-60 \`\`\``);
			break;
		default:
			message.channel.send(`\`\`\`prolog
!SWRPG: uses swrpg dice for this channel
!GENESYS: uses genesys dice for this channel
!L5R: uses l5r dice in this channel

!Roll: rolls any combination of L5R dice
!Poly: rolls any combination of polyhedral dice
!Keep: ie !keep 12 - keeps the first, second, and discards the rest of the dice
!Add: ie !add ww - adds specified dice to previous dicepool.
!Reroll: ie !reroll 12 - rerolls the first and second dice without modifying the rest of the dicepool
!Help: displays help for topics

for more information or help join the FFG NDS Assistant Bot server https://discord.gg/G8au6FH\`\`\`
Role playing games by Fantasy Flight Games
<https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game/>`);
			break;
	}
}

exports.help = help;
