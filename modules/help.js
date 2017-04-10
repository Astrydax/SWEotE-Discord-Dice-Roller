exports.help = function help(params, message) {
  console.log ("!help command");
if (params == "") {
  message.channel.sendMessage("```prolog\ntype '!Help [topic]' for futher information\n!Roll: rolls any combination of swrpg dice\n!D100: rolls a d100 with optional modifier\n!Destiny: manages the destiny balance\n!Crit: rolls and displays the critical hit\n!Shipcrit: rolls and displays the ship critical hit\n!Char: simple character stat manager\n!Ver: displays bot version\n!Help: displays help for topics\n\nfor more information join the SWRPG Assistant Bot discord server 'https://discord.gg/G8au6FH'\n```");
} else {
  var topic = params[0];
  switch (topic) {
    case "destiny":
      message.channel.sendMessage("```prolog\n!Destiny: view the destiny pool\n\n!Destiny Roll: rolls a force die and adds result to the destiny pool\n\n!Destiny L/Light: uses light side point\n\n!Destiny D/Dark: uses dark side point\n\n!Destiny Set #L #D: sets destiny pool\n\n!Destiny Set LLDD: sets destiny pool\n\n!Destiny Reset: resets the destiny pool\n\n```");
      break;
    case "char":
      message.channel.sendMessage("```prolog\n!Char: simple character stat manager\n\n!Char Setup CharacterName [MaxWound] [MaxStrain] [Credits]: setup a new character\n\n!Char Wound/W CharacterName +X/-X: increases/decreases wounds for characterName by x\n\n!Char Strain/S CharacterName +X/-X: increases/decreases strain for characterName by x\n\n!Char Credits/C CharacterName +X/-X: increases/decreases credit balance for characterName by x\n\n!Char Status CharacterName: current status for characterName\n\n!Char List: displays all characters\n\n!Char Reset: resets all the characters\n```");
      break;
    case "roll":
      message.channel.sendMessage("```prolog\n!Roll: rolls any combination of swrpg dice and returns the canceled results\n\nyou may add \" \" in the line to give the roll a label\n\nDICE IDENTIFIERS\n\n\tY/Pro = yellow/proficiency\n\tG/A = green/ability\n\tB/Boo = blue/boost\n\tBlk/K/Sb/S = black/setback\n\tR/C = red/challenge\n\tP/Diff = purple/difficulty\n\tW/F = white/worce\n\nNote: if you use the !roll yyyggbbd method you must use the single character dice identifiers\n```");
      break;
    default:
      break;
    }
  }
}
