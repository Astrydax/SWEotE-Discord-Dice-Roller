function help(params, message) {
  if (params == "") {
    message.channel.send("```prolog\ntype '!Help [topic]' for further information\n!Roll: rolls any combination of swrpg dice\n!Poly: rolls any combination of polyhedral dice\n!Reroll: modifies the previous roll\n!DX: rolls a polyhedral die (x = any number) with optional modifier\n!Destiny: manages the destiny balance\n!Crit: rolls and displays the critical hit\n!Shipcrit: rolls and displays the ship critical hit\n!Char: simple character stat manager\n!Ver: displays bot version\n!Init: initiative tracker and roller\n!Obligation: gathers all the obligations entered with !Char and rolls to trigger\n!Species/!Gleepglop: picks a random species\n!SWRPG: uses swrpg dice for this channel\n!GENESYS: uses genesys dice for this channel\n!Help: displays help for topics\n\nfor more information join the SWRPG Assistant Bot discord server 'https://discord.gg/G8au6FH'\n```");
  } else {
    var topic = params[0];
    switch (topic) {
      case "destiny":
        message.channel.send("```prolog\n!Destiny: view the destiny pool\n\n!Destiny Roll: rolls a force die and adds result to the destiny pool\n\n!Destiny L/Light: uses light side point\n\n!Destiny D/Dark: uses dark side point\n\n!Destiny Set #L #D: sets destiny pool\n\n!Destiny Set LLDD: sets destiny pool\n\n!Destiny Reset: resets the destiny pool\n\n```");
        break;
      case "char":
        message.channel.send("```prolog\n!Char: simple character stat manager\n\n!Char Setup CharacterName MaxWound MaxStrain Credits: setup a new character\n\n!Char Wound/W CharacterName +X/-X: increases/decreases wounds for characterName by x\n\n!Char Strain/S CharacterName +X/-X: increases/decreases strain for characterName by x\n\n!Char Credits/C CharacterName +X/-X: increases/decreases credit balance for characterName by x\n\n!Char Crit CharacterName +X/-X: adds/removes critical injuries for characterName\n\n!Char Obligation/O CharacterName +X/-X ObligationName: adds/removes obligations for characterName\n\n!Char Modify CharacterName +X/-X MaxStrain/MaxWounds: increases/decreases selected stat for characterName by x\n\n!Char Status CharacterName: current status for characterName\n\n!Char Remove CharacterName: removes characterName\n\n!Char List: displays all characters\n\n!Char Reset: resets all the characters\n```");
        break;
      case "roll":
        message.channel.send("```prolog\nCOMMAND\n\n\t!Roll DiceIdentifiers \"TEXT\"\n\nDICE IDENTIFIERS\n\n\tY/Pro = yellow/proficiency\n\tG/A = green/ability\n\tB/Boo = blue/boost\n\tBlk/K/Sb/S = black/setback\n\tR/C = red/challenge\n\tP/Diff/D = purple/difficulty\n\tW/F = white/force\n\tSuccess/Suc/ *  = success\n\tAdvantage/Adv/V = advantage\n\tTriumph/Tri/! = triumph\n\tFailure/Fail/- = failure\n\tThreat/Thr/T = threat\n\tDespair/Des/$ = despair\n\tLight/L = lightside point\n\tDark/N = darkside point\n\n\"TEXT\" assigns a label to the roll. (optional)\n\nExamples:\n\t!roll yyyggbbd (must use single character identifiers)\n\t!roll 1g 1p 1adv (must specify a number before each identifier)\n\t```");
        break;
      case "init":
        message.channel.send("```prolog\n!Init: shows current initiative order\n!Init Roll DiceIdentifiers NPC/PC: rolls your initiative dice and adds character to the order\n!Init Next: moves to next initiative slot\n!Init Previous: moves to previous initiative slot\n!Init Set: manually set initiative order before any turns occur\n!Init Modify: manually alter initiative order mid-round\n!Init Reset: resets the initiative order\n```");
        break;
      case "reroll":
        message.channel.send("```prolog\n!Reroll Same: rolls the same pool again\n\n!Reroll Add DiceIdentifiers: roll additional dice and adds them to the pool\n\n!Reroll Remove DiceIdentifiers: remove random dice of the designated color\n\n!Reroll Select DiceColor/DicePosition: rerolls specified dice\n\n\tie !Reroll Select Y3 P1: rerolls only the 3rd yellow die and the 1st purple die in the current dice pool\n\n\n!Reroll Fortune Show DiceColor/DicePosition: shows adjacent sides for the specified die\n\n\tie !Reroll Fortune Show Y1 P2  (shows the adjacent side for the 1st yellow and 2 purple dicefaces)\n\n\n!Reroll Fortune Swap DiceColor/DicePosition AdjacentFace (From !Reroll Fortune Show Command): swaps the current face for an adjacent one\n\n\tie !Reroll Fortune Swap 2Y 3: swaps the current die face on the 2nd yellow with option 3 of the adjacent sides\n```")
        break;
      case "poly":
        message.channel.send("```prolog\n!Poly: rolls any combination of polyhedral dice with modifier\n\nExamples:\n\t!poly 1d4 2d6+1 1d100-60 ```");
        break;
      case "crit":
      case "shipcrit":
        message.channel.send("```prolog\n!Crit and !Shipcrit: rolls a d100 and matches the roll to the appropriate critical injury table then prints the result\n\n!Crit +10: automatically add 10 to the roll (any number can be used)\n\n!Crit -10: automatically subtract 10 to the roll (any number can be used)\n\n!Crit 54?: look up crit by number (any number can be used)```");
        break;
      default:
        break;
      }
    }
  }

module.exports = {
    help: help,
};
