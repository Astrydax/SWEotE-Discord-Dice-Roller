const _ = require('lodash');

function help(bot, message, topic, prefix) {
	switch (topic) {
		case "destiny":
			message.channel.send(`\`\`\`prolog
${prefix}Destiny: view the destiny points
${prefix}Destiny Roll: rolls a force die and adds result to the destiny pool
${prefix}Destiny L/Light: uses light side point
${prefix}Destiny D/Dark: uses dark side point
${prefix}Destiny Set #L #D: sets destiny pool
${prefix}Destiny Set LLDD: sets destiny pool
${prefix}Destiny Reset: resets the destiny pool
\`\`\``);
			break;
		case "story":
			message.channel.send(`\`\`\`prolog
${prefix}Story: view the destiny points
${prefix}Story Roll: rolls a white die and adds result to the story points
${prefix}Story P/Player: uses light side point
${prefix}Story G/GM: uses dark side point
${prefix}Story Set #P #G: sets story points
${prefix}Story Set PPGG: sets story points
${prefix}Story Reset: resets the story points
\`\`\``);
			break;
		case "char":
			message.channel.send(`\`\`\`prolog
${prefix}Char: simple character stat manager
${prefix}Char Setup CharacterName MaxWound MaxStrain Credits: setup a new character
${prefix}Char Wound/W CharacterName +X/-X: increases/decreases wounds for characterName by x
${prefix}Char Strain/S CharacterName +X/-X: increases/decreases strain for characterName by x
${prefix}Char Credits/C CharacterName +X/-X: increases/decreases credit balance for characterName by x
${prefix}Char Crit CharacterName +X/-X: adds/removes critical injuries for characterName
${prefix}Char Obligation/O CharacterName +X/-X ObligationName: adds/removes obligations for characterName
${prefix}Char Duty/D CharacterName +X/-X DutyName: adds/removes duty for characterName
${prefix}Char Inventory/I CharacterName +X/-X ItemName: adds/removes inventory items for characterName
${prefix}Char Modify CharacterName +X/-X MaxStrain/MaxWounds: increases/decreases selected stat for characterName by x
${prefix}Char Status CharacterName: current status for characterName
${prefix}Char Remove CharacterName: removes characterName
${prefix}Char List: displays all characters
${prefix}Char Reset: resets all the characters
\`\`\``);
			break;
		case "roll":
			message.channel.send(`\`\`\`prolog
${prefix}Roll DiceIdentifiers "TEXT"
DICE IDENTIFIERS
    Y/Pro = yellow/proficiency
    G/A = green/ability
    B/Boo = blue/boost
    Blk/K/Sb/S = black/setback
    R/C = red/challenge
    P/Diff/D = purple/difficulty
    W/F = white/force
    Success/Suc/ *  = success
    Advantage/Adv/V = advantage
    Triumph/Tri/! = triumph
    Failure/Fail/- = failure
    Threat/Thr/T = threat
    Despair/Des/$ = despair
    Light/L = lightpip
    Dark/N = darkpip
    "TEXT" assigns a label to the roll. (optional)
    
Examples:
    ${prefix}roll yyyggbbd (must use single character identifiers)
    ${prefix}roll 1g 1p 1adv (must specify a number before each identifier)
\`\`\``);
			break;
		case "init":
			message.channel.send(`\`\`\`prolog
${prefix}Init: shows current initiative order
${prefix}Init Roll DiceIdentifiers NPC/PC: rolls your initiative dice and adds character to the order
${prefix}Init Next: moves to next initiative slot
${prefix}Init Previous: moves to previous initiative slot
${prefix}Init Set: manually set initiative order before any turns occur
${prefix}Init Modify: manually alter initiative order mid-round
${prefix}Init Reset: resets the initiative order
${prefix}Init Remove X: remove a slot where is is the position

\`\`\``);
			break;
		case "reroll":
			message.channel.send(`\`\`\`prolog
${prefix}Reroll Same: rolls the same pool again
${prefix}Reroll Add DiceIdentifiers: roll additional dice and adds them to the pool
${prefix}Reroll Remove DiceIdentifiers: remove random dice of the designated color
${prefix}Reroll Select DiceColor/DicePosition: rerolls specified dice
    ie ${prefix}Reroll Select Y3 P1: rerolls only the 3rd yellow die and the 1st purple die in the current dice pool
    
${prefix}Reroll Fortune Show DiceColor/DicePosition: shows adjacent sides for the specified die
    ie ${prefix}Reroll Fortune Show Y1 P2  (shows the adjacent side for the 1st yellow and 2 purple dicefaces)

${prefix}Reroll Fortune Swap DiceColor/DicePosition AdjacentFace (From ${prefix}Reroll Fortune Show Command): swaps the current face for an adjacent one
    ie ${prefix}Reroll Fortune Swap 2Y 3: swaps the current die face on the 2nd yellow with option 3 of the adjacent sides
\`\`\``);
			break;
		case "poly":
			message.channel.send(`\`\`\`prolog
${prefix}Poly: rolls any combination of polyhedral dice with modifier
Examples:
    poly 1d4 2d6+1 1d100-60 
\`\`\``);
			break;
		case "prefix":
			message.channel.send(`\`\`\`prolog
${prefix}Prefix: changes the activation prefix for the bot.
Examples:
    prefix ^, prefix & 
\`\`\`
NOTE: User needs to have a higher role than the bot. 
See more: https://support.discordapp.com/hc/en-us/articles/214836687-Role-Management-101`);
			break;
		case "crit":
		case "shipcrit":
			message.channel.send(`\`\`\`prolog
${prefix}Crit and ${prefix}Shipcrit: rolls a d100 and matches the roll to the appropriate critical injury table then prints the result
${prefix}Crit +10: automatically add 10 to the roll (any number can be used)
${prefix}Crit -10: automatically subtract 10 to the roll (any number can be used)
${prefix}Crit 54?: look up crit by number (any number can be used)
\`\`\``);
			break;
		case "duty":
		case "obligation":
			message.channel.send(`\`\`\`prolog
${prefix}${_.upperFirst(topic)}: gathers all ${topic} from ${prefix}Char and rolls a d100 to trigger ${topic}
\`\`\``);
			break;
		default:
			message.channel.send(`\`\`\`prolog
type '${prefix}Help [topic]' for further information

${prefix}SWRPG: uses swrpg dice for this channel
${prefix}GENESYS: uses genesys dice for this channel
${prefix}L5R: uses l5r dice in this channel

${prefix}Poly: rolls any combination of polyhedral dice
${prefix}Ver: displays bot version
${prefix}Prefix: changes the prefix to activate the bot (role needs to be higher than the bot)
${prefix}Help: displays help for topics

${prefix}Roll: rolls any combination of SWRPG/GENESYS dice
${prefix}Reroll: modifies the previous roll
${prefix}Destiny: manages the destiny balance
${prefix}Crit: rolls and displays the critical hit
${prefix}Shipcrit: rolls and displays the ship critical hit
${prefix}Char: simple character stat manager
${prefix}Init: initiative tracker and roller
${prefix}Obligation: gathers all the obligations entered with ${prefix}Char and rolls to trigger
${prefix}Duty: gathers all the duty entered with ${prefix}Char and rolls to trigger
${prefix}Species/${prefix}Gleepglop: picks a random species
\`\`\`
for more information or help join the FFG NDS Assistant Bot server https://discord.gg/G8au6FH

Role playing games by Fantasy Flight Games 
<https://www.fantasyflightgames.com/en/products/star-wars-edge-of-the-empire>
<https://www.fantasyflightgames.com/en/products/star-wars-force-and-destiny>
<https://www.fantasyflightgames.com/en/products/star-wars-age-ofrebellion>
<https://www.fantasyflightgames.com/en/products/genesys>
<https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game>
`);
			break;
	}
}

exports.help = help;
