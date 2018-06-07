function help(bot, message, params) {
    if (!params[0]) {
        message.channel.send(
            `\`\`\`prolog
type '!Help [topic]' for further information

!Roll: rolls any combination of swrpg dice
!Poly: rolls any combination of polyhedral dice
!Reroll: modifies the previous roll
!DX: rolls a polyhedral die (x = any number) with optional modifier
!Destiny: manages the destiny balance
!Crit: rolls and displays the critical hit
!Shipcrit: rolls and displays the ship critical hit
!Char: simple character stat manager
!Ver: displays bot version
!Init: initiative tracker and roller
!Obligation: gathers all the obligations entered with !Char and rolls to trigger
!Species/!Gleepglop: picks a random species
!SWRPG: uses swrpg dice for this channel
!GENESYS: uses genesys dice for this channel
!Help: displays help for topics

for more information join the SWRPG Assistant Bot discord server 'https://discord.gg/G8au6FH'
\`\`\``);
    } else {
        let topic = params[0];
        switch (topic) {
            case "destiny":
                message.channel.send(
                    `\`\`\`prolog
!Destiny: view the destiny points
!Destiny Roll: rolls a force die and adds result to the destiny pool
!Destiny L/Light: uses light side point
!Destiny D/Dark: uses dark side point
!Destiny Set #L #D: sets destiny pool
!Destiny Set LLDD: sets destiny pool
!Destiny Reset: resets the destiny pool
\`\`\``);
                break;
            case "story":
                message.channel.send(
                    `\`\`\`prolog
!Story: view the destiny points
!Story Roll: rolls a white die and adds result to the story points
!Story P/Player: uses light side point
!Story G/GM: uses dark side point
!Story Set #P #G: sets story points
!Story Set PPGG: sets story points
!Story Reset: resets the story points
\`\`\``);
                break;
            case "char":
                message.channel.send(
                    `\`\`\`prolog
!Char: simple character stat manager
!Char Setup CharacterName MaxWound MaxStrain Credits: setup a new character
!Char Wound/W CharacterName +X/-X: increases/decreases wounds for characterName by x
!Char Strain/S CharacterName +X/-X: increases/decreases strain for characterName by x
!Char Credits/C CharacterName +X/-X: increases/decreases credit balance for characterName by x
!Char Crit CharacterName +X/-X: adds/removes critical injuries for characterName
!Char Obligation/O CharacterName +X/-X ObligationName: adds/removes obligations for characterName
!Char Modify CharacterName +X/-X MaxStrain/MaxWounds: increases/decreases selected stat for characterName by x
!Char Status CharacterName: current status for characterName
!Char Remove CharacterName: removes characterName
!Char List: displays all characters
!Char Reset: resets all the characters
\`\`\``);
                break;
            case "roll":
                message.channel.send(
                    `\`\`\`prolog
!Roll DiceIdentifiers "TEXT"
DICE IDENTIFIERS
    Pro = yellow/proficiency
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
    Light/L = lightside point
    Dark/N = darkside point
    "TEXT" assigns a label to the roll. (optional)
    
Examples:
    !roll yyyggbbd (must use single character identifiers)
    !roll 1g 1p 1adv (must specify a number before each identifier)
\`\`\``);
                break;
            case "init":
                message.channel.send(
                    `\`\`\`prolog
!Init: shows current initiative order
!Init Roll DiceIdentifiers NPC/PC: rolls your initiative dice and adds character to the order
!Init Next: moves to next initiative slot
!Init Previous: moves to previous initiative slot
!Init Set: manually set initiative order before any turns occur
!Init Modify: manually alter initiative order mid-round
!Init Reset: resets the initiative order
!Init Remove X: remove a slot where is is the position

\`\`\``);
                break;
            case "reroll":
                message.channel.send(
                    `\`\`\`prolog
!Reroll Same: rolls the same pool again
!Reroll Add DiceIdentifiers: roll additional dice and adds them to the pool
!Reroll Remove DiceIdentifiers: remove random dice of the designated color
!Reroll Select DiceColor/DicePosition: rerolls specified dice
    ie !Reroll Select Y3 P1: rerolls only the 3rd yellow die and the 1st purple die in the current dice pool
    
!Reroll Fortune Show DiceColor/DicePosition: shows adjacent sides for the specified die
    ie !Reroll Fortune Show Y1 P2  (shows the adjacent side for the 1st yellow and 2 purple dicefaces)

!Reroll Fortune Swap DiceColor/DicePosition AdjacentFace (From !Reroll Fortune Show Command): swaps the current face for an adjacent one
    ie !Reroll Fortune Swap 2Y 3: swaps the current die face on the 2nd yellow with option 3 of the adjacent sides
\`\`\``);
                break;
            case "poly":
                message.channel.send(
                    `\`\`\`prolog
!Poly: rolls any combination of polyhedral dice with modifier
Examples:
    poly 1d4 2d6+1 1d100-60 
\`\`\``);
                break;
            case "crit":
            case "shipcrit":
                message.channel.send(
                    `\`\`\`prolog
!Crit and !Shipcrit: rolls a d100 and matches the roll to the appropriate critical injury table then prints the result
!Crit +10: automatically add 10 to the roll (any number can be used)
!Crit -10: automatically subtract 10 to the roll (any number can be used)
!Crit 54?: look up crit by number (any number can be used)
\`\`\``);
                break;
            default:
                break;
        }
    }
}

exports.help = help;
