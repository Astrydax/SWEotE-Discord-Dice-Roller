/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/

const Discord = require("discord.js");
const config = require("./config.json");
var chalk = require("chalk");
const bot = new Discord.Client();
var print = require("./printValues.json");

bot.login(config.token);

var version = "1.2.0";
var destinyBalance = {
  light: 0,
  dark: 0,
  face: "",
};

//Called When bot becomes functional.
bot.on("ready", () => {
  console.log(`Bot version ${version}`);
  console.log(`Logged in as ${bot.user.username}!`);
  if (config.maxRollsPerDie >= 100) {
    console.warn(chalk.white.bgRed("!!!WARNING!!! maxRollsPerDie in config.json must be set between 1-99 otherwise errors may occur in rolls"));
  }

  //Point print out to print or text
  if (config.emoji == true) {
    console.log("emoji set to true");
    print = print.emoji;
  }

  if (config.emoji == false) {
    console.log("emoji set to false");
    print = print.text;
  }

  //console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
});

//Called whenever a users send a message to the server
bot.on("message", message => {
  //Ignore messages sent by the bot
  if (message.author.bot) return;

  //Ignore messages that dont start with the command symbol
  if (!message.content.startsWith(config.prefix)) return;

  //Seperate and create a list of parameters. A space in the message denotes a new parameter
  const params = message.content.split(" ").slice(1);

  //************************COMMANDS START HERE************************

  // Command to kill the bot application
  // if(message.content.startsWith(config.prefix + "kill")){
  //   console.log("!kill command was called... Now Exiting");
  //   process.exit();
  // }

  // D100 command
  if (message.content.toLowerCase().startsWith(config.prefix + "d100")) {
    //addition modifer
    if (params.includes("+")) {
      console.log("+ modifer detected");
      var modifier = params[1];
      let r = Math.floor(Math.random() * 100) + 1;
      total = r + modifier;
      message.channel.sendMessage(message.author.username + " rolled: " + r + " + " + modifier + " " + "for a total of " + total);
      //subtraction modifier
    } else if (params.includes("-")) {
      console.log("- modifer detected");
      var modifier = params[1]
      let r = Math.floor(Math.random() * 100) + 1;
      total = r - modifier;
      message.channel.sendMessage(message.author.username + " rolled: " + r + " - " + modifier + " " + "for a total of " + total);
      //no modifier
    } else {
      console.log("No modifier, straight d100 roll");
      let r = Math.floor(Math.random() * 100) + 1;
      total = r;
      message.channel.sendMessage(" rolled: " + total);
    }
  }
  //!crit command
  if (message.content.toLowerCase().startsWith(config.prefix + "crit")) {
    var total = 0;
    var crit = {
      option1: print.pb + "Minor Nick: The target suffers 1 strain.",
      option2: print.pb + "Slowed Down: The target can only act during the last allied Initiative slot on his next turn.",
      option3: print.pb + "Sudden Jolt: The target drops whatever is in hand.",
      option4: print.pb + "Distracted: The target cannot perform a free maneuver during his next turn.",
      option5: print.pb + "Off-Balance. Add " + print.blkb + " to his next skill check.",
      option6: print.pb + "Discouraging Wound: Flip one light side Destiny point to a dark side Destiny Point (reverse if NPC).",
      option7: print.pb + "Stunned: The target is staggered until the end of his next turn.",
      option8: print.pb + "Stinger: Increase difficulty of next check by one.",
      option9: print.pb + print.pb + "Bowled Over: The target is knocked prone and suffers 1 strain.",
      option10: print.pb + print.pb + "Head Ringer: The target increases the difficulty of all Intellect and Cunning Checks by one until the end of the encounter.",
      option11: print.pb + print.pb + "Fearsome Wound: The target increases the difficulty of all Presence and Willpower checks by one until the end of the encounter.",
      option12: print.pb + print.pb + "Agonizing Wound: The target increases the difficulty of all Brawn and Agility checks by one until the end of the encounter.",
      option13: print.pb + print.pb + "Slightly Dazed: The target is disoriented until the end of the encounter.",
      option14: print.pb + print.pb + "Scattered Senses: The target removes all " + print.bb + " from skill checks until end of encounter.",
      option15: print.pb + print.pb + "Hamstrung: The target loses his free maneuver until the end of the encounter.",
      option16: print.pb + print.pb + "Overpowered: The target leaves himself open, and the attacker may immediately attempt another free attack against him, using the exact same pool as the original attack.",
      option17: print.pb + print.pb + "Winded: Until the end of the encounter, the target cannot voluntarily suffer strain to activate any abilities or gain additional maneuvers.",
      option18: print.pb + print.pb + "Compromised: Increase difficulty of all skill checks by one until the end of the encounter.",
      option19: print.pb + print.pb + print.pb + "At the Brink: The target suffers 1 strain each time he performs an action.",
      option20: print.pb + print.pb + print.pb + "Crippled: One of the target’s limbs (selected by the GM) is crippled until healed or replaced. Increase difficulty of all checks that require use of that limb by one.",
      option21: print.pb + print.pb + print.pb + "Maimed: One of the target’s limbs (selected by the GM) is permanently lost. Unless the target has a cybernetic replacement, the target cannot perform actions that would require the use of that limb. All other actions gain " + print.blkb + ".",
      option22: print.pb + print.pb + print.pb + "Horrific Injury. Randomly roll 1d100 to determine one of the target's characteristics—1-30 for Brawn, 31-60 for Agility, 61-70 for Intellect, 71-80 for Cunning, 81-90 for Presence, 91-100 for Willpower. Until this Critical Injury is healed, treat that characteristic as one point lower.",
      option23: print.pb + print.pb + print.pb + "Temporarily Lame: Until this Critical Injury is healed, the target cannot perform more than one maneuver during his turn.",
      option24: print.pb + print.pb + print.pb + "Blinded: The target can no longer see. Upgrade the difficulty of all checks twice. Upgrade the difficulty of Perception and Vigilance checks three times.",
      option25: print.pb + print.pb + print.pb + "Knocked Senseless: The target is staggered for the remainder of the encounter.",
      option26: print.pb + print.pb + print.pb + print.pb + "Gruesome Injury. Randomly roll 1d100 to determine one of the target's characteristics—1-30 for Brawn, 31-60 for Agility, 61-70 for Intellect, 71-80 for Cunning, 81-90 for Presence, 91-100 for Willpower. That characteristic is permanently reduced by one, to a minimum of one.",
      option27: print.pb + print.pb + print.pb + print.pb + "Bleeding Out: Every round, the target suffers 1 wound and 1 strain at the beginning of his turn. For every five wounds he suffers beyond his wound threshold, he suffers one additional Critical Injury. Roll on the chart, suffering the injury (if he suffers this result a second time due to this, roll again).",
      option28: print.pb + print.pb + print.pb + print.pb + "The End is Nigh: The target will die after the last Initiative slot during the next round.",
      option29: "Dead: Complete, obliterated death."
    };

    //addition modifer
    if (params.includes("+")) {
      console.log("+ modifer detected");
      var modifier = params[1];
      let r = Math.floor(Math.random() * 100) + 1;
      total = r + modifier;
      message.channel.sendMessage(message.author.username + " rolled: " + r + " + " + modifier + " " + "for a total of " + total);
      //subtraction modifier
    } else if (params.includes("-")) {
      console.log("- modifer detected");
      var modifier = params[1]
      let r = Math.floor(Math.random() * 100) + 1;
      total = r - modifier;
      message.channel.sendMessage(message.author.username + " rolled: " + r + " - " + modifier + " " + "for a total of " + total);
      //no modifier
    } else {
      console.log("No modifier, straight d100 roll");
      let r = Math.floor(Math.random() * 100) + 1;
      total = r;
      message.channel.sendMessage(message.author.username + " rolled: " + total);
    }
    //build textCrit
    var textCrit = "";
    switch (true) {
      case (total < 5):
        textCrit = crit.option1;
        break;
      case (total >= 6 && total <= 10):
        textCrit = crit.option2;
        break;
      case (total >= 11 && total <= 15):
        textCrit = crit.option3;
        break;
      case (total >= 16 && total <= 20):
        textCrit = crit.option4;
        break;
      case (total >= 21 && total <= 25):
        textCrit = crit.option5;
        break;
      case (total >= 26 && total <= 30):
        textCrit = crit.option6;
        break;
      case (total >= 31 && total <= 35):
        textCrit = crit.option7;
        break;
      case (total >= 36 && total <= 40):
        textCrit = crit.option8;
        break;
      case (total >= 41 && total <= 45):
        textCrit = crit.option9;
        break;
      case (total >= 46 && total <= 50):
        textCrit = crit.option10;
        break;
      case (total >= 51 && total <= 55):
        textCrit = crit.option11;
        break;
      case (total >= 56 && total <= 60):
        textCrit = crit.option12;
        break;
      case (total >= 61 && total <= 65):
        textCrit = crit.option13;
        break;
      case (total >= 66 && total <= 70):
        textCrit = crit.option14;
        break;
      case (total >= 71 && total <= 75):
        textCrit = crit.option15;
        break;
      case (total >= 76 && total <= 80):
        textCrit = crit.option16;
        break;
      case (total >= 81 && total <= 85):
        textCrit = crit.option17;
        break;
      case (total >= 86 && total <= 90):
        textCrit = crit.option18;
        break;
      case (total >= 91 && total <= 95):
        textCrit = crit.option19;
        break;
      case (total >= 96 && total <= 100):
        textCrit = crit.option20;
        break;
      case (total >= 101 && total <= 105):
        textCrit = crit.option21;
        break;
      case (total >= 106 && total <= 110):
        textCrit = crit.option22;
        break;
      case (total >= 111 && total <= 115):
        textCrit = crit.option23;
        break;
      case (total >= 116 && total <= 120):
        textCrit = crit.option24;
        break;
      case (total >= 121 && total <= 125):
        textCrit = crit.option25;
        break;
      case (total >= 126 && total <= 130):
        textCrit = crit.option26;
        break;
      case (total >= 131 && total <= 140):
        textCrit = crit.option27;
        break;
      case (total >= 141 && total <= 150):
        textCrit = crit.option28;
        break;
      case (total >= 151):
        textCrit = crit.option29;
        break;
      default:
        console.log("Something has gone horribly wrong. total is " + total);
        break;
    }
    message.channel.sendMessage("Crit " + total + ": " + textCrit);
  }
  //!shipcrit command
  if (message.content.toLowerCase().startsWith(config.prefix + "shipcrit")) {
    var total = 0;
    var crit = {
      option1: print.pb + "Mechanical Stress: The ship or vehicle suffers one point of system strain.",
      option2: print.pb + "Jostled: A small explosion or impact rocks the vehicle. All crew members suffer one strain and are disoriented for one round.",
      option3: print.pb + "Losing Power to Shields: Decrease defense in affected defense zone by one until the Critical Hit is repaired. If the ship or vehicle has no defense, suffer one point of system strain.",
      option4: print.pb + "Knocked Off Course: A particularly strong blast or impact sends the ship or vehicle careening off in a new direction. On his next turn, the pilot cannot execute any maneuvers and must make a Piloting check to regain control. The difficulty of this check depends on his current speed.",
      option5: print.pb + "Tailspin: All firing from the ship or vehicle suffers " + print.blkb + print.blkb + " dice until the end of the pilot’s next turn. All crewmembers are immobilized until the end of the pilot’s next turn.",
      option6: print.pb + "Component Hit: One component of the attacker’s choice is knocked offline, and is rendered inoperable until the end of the following round. For a list of ship components, see EotE Core Rulebook Table 7-10: Small Ship or Vehicle Components or Table 7-11: Large Ship or Vehicle Components depending on target ship silhouette.",
      option7: print.pb + print.pb + "Shields Failing: Reduce defense in all defense zones by one point until the Critical Hit is repaired. If the ship or vehicle has no defense, suffer two points of system strain.",
      option8: print.pb + print.pb + "Navicomputer Failure: The navicomputer (or in the case of a ship without a navicomputer, its R2 unit) fails and the ship cannot make the jump to hyperspace until the Critical Hit is repaired. If the ship or vehicle is without a hyperdrive, the vehicle or ship’s navigation systems fail, leaving it flying or driving blind, unable to tell where it is or where it’s going.",
      option9: print.pb + print.pb + "Power Fluctuations: The ship or vehicle is beset by random power surges and outages. The pilot cannot voluntarily inflict system strain on the ship (to gain an extra starship maneuver, for example), until this Critical Hit is repaired.",
      option10: print.pb + print.pb + print.pb + "Shields Down: Decrease defense in affected defense zone to zero, and decrease defense in all other defense zones by one until this Critical Hit is repaired. While the defense of the affected defense zone cannot be restored until the Critical Hit is repaired, defense can be assigned to protect that defense zone from other zones as usual. If the ship or vehicle is without defense, suffer four points of system strain.",
      option11: print.pb + print.pb + print.pb + "Engine Damaged: The ship or vehicle’s maximum speed is reduced by one point, to a minimum of one, until the Critical Hit is repaired.",
      option12: print.pb + print.pb + print.pb + "Shield Overload: The ship’s shields completely fail. Decrease the defense of all defense zones to zero. This Critical Hit cannot be repaired until the end of the encounter, and the ship suffers two points of system strain. If the ship or vehicle is without defense, reduce armor by 1 until the Critical Hit is repaired.",
      option13: print.pb + print.pb + print.pb + "Engines Down: The ship or vehicle’s maximum speed is reduced to zero until the Critical Hit is repaired, although it continues on its present course thanks to momentum. In addition, the ship cannot execute any maneuvers until the Critical Hit is repaired.",
      option14: print.pb + print.pb + print.pb + "Major System Failure: One component of the attacker’s choice is heavily damaged, and is inoperable until the Critical Hit is repaired. For a list of ship components, see EotE Core Rulebook Table 7-10: Small Ship or Vehicle Components or Table 7-11: Large Ship or Vehicle Components depending on target ship silhouette.",
      option15: print.pb + print.pb + print.pb + print.pb + "Major Hull Breach: A huge, gaping tear is torn in the ship’s hull and it depressurizes. For ships and vehicles of silhouette 4 and smaller, the entire ship depressurizes in a number of rounds equal to the ship’s silhouette. Ships and vehicles of silhouette 5 and larger tend to be highly compartmentalized and have many safeguards against depressurization. These ships don’t completely depressurize, but parts do (the specifics of which parts depressurize is up to the GM; however each section of the ship or vehicle that does lose air does so in a number of rounds equal to the vehicle’s silhouette). Vehicles and ships operating in an atmosphere can better handle this Critical Hit. However, the huge tear still inflicts penalties, causing the vehicle to suffer the Destabilized Critical Hit instead.",
      option16: print.pb + print.pb + print.pb + print.pb + "Destabilized: The ship or vehicle’s structural integrity is seriously damaged. Reduce the ship or vehicle’s hull trauma threshold and system strain threshold to half their original values until repaired.",
      option17: print.pb + print.pb + print.pb + print.pb + "Fire!: Fire rages through the ship. The ship or vehicle immediately takes two points of system strain, and anyone caught in the fire takes damage as discussed on page 214 of the EotE Core Rulebook. A fire can be put out with some quick thinking and appropriate skill, Vigilance and/or Cool checks at the Game Master’s discretion. Once going, a fire takes one round per two of the ship’s silhouette points to put out.",
      option18: print.pb + print.pb + print.pb + print.pb + "Breaking Up: The vehicle or ship has suffered so much damage that it begins to come apart at its seams, breaking up and disintegrating around the crew. At the end of the following round, the ship is completely destroyed and the surrounding environment is littered with debris. Anyone aboard the ship or vehicle has one round to get to an escape pod, bail out, or dive for the nearest hatch before they are lost.",
      option19: "Vaporized: The ship or vehicle is completely destroyed, consumed in a particularly large and dramatic fireball. Nothing survives."
    };

    //addition modifer
    if (params.includes("+")) {
      console.log("+ modifer detected");
      var modifier = params[1];
      let r = Math.floor(Math.random() * 100) + 1;
      total = r + modifier;
      message.channel.sendMessage(message.author.username + " rolled: " + r + " + " + modifier + " " + "for a total of " + total);
      //subtraction modifier
    } else if (params.includes("-")) {
      console.log("- modifer detected");
      var modifier = params[1]
      let r = Math.floor(Math.random() * 100) + 1;
      total = r - modifier;
      message.channel.sendMessage(message.author.username + " rolled: " + r + " - " + modifier + " " + "for a total of " + total);
      //no modifier
    } else {
      console.log("No modifier, straight d100 roll");
      let r = Math.floor(Math.random() * 100) + 1;
      total = r;
      message.channel.sendMessage(message.author.username + " rolled: " + total);
    }
    //build textCrit
    var textCrit = "";
    switch (true) {
      case (total <= 9):
        textCrit = crit.option1;
        break;
      case (total >= 10 && total <= 18):
        textCrit = crit.option2;
        break;
      case (total >= 19 && total <= 27):
        textCrit = crit.option3;
        break;
      case (total >= 28 && total <= 36):
        textCrit = crit.option4;
        break;
      case (total >= 37 && total <= 45):
        textCrit = crit.option5;
        break;
      case (total >= 46 && total <= 54):
        textCrit = crit.option6;
        break;
      case (total >= 55 && total <= 63):
        textCrit = crit.option7;
        break;
      case (total >= 64 && total <= 72):
        textCrit = crit.option8;
        break;
      case (total >= 73 && total <= 81):
        textCrit = crit.option9;
        break;
      case (total >= 82 && total <= 90):
        textCrit = crit.option10;
        break;
      case (total >= 91 && total <= 99):
        textCrit = crit.option11;
        break;
      case (total >= 100 && total <= 108):
        textCrit = crit.option12;
        break;
      case (total >= 109 && total <= 117):
        textCrit = crit.option13;
        break;
      case (total >= 118 && total <= 126):
        textCrit = crit.option14;
        break;
      case (total >= 127 && total <= 133):
        textCrit = crit.option15;
        break;
      case (total >= 134 && total <= 138):
        textCrit = crit.option16;
        break;
      case (total >= 139 && total <= 144):
        textCrit = crit.option17;
        break;
      case (total >= 145 && total <= 153):
        textCrit = crit.option18;
        break;
      case (total >= 154):
        textCrit = crit.option19;
        break;
      default:
        console.log("Something has gone horribly wrong. total is " + total);
        break;
    }
    message.channel.sendMessage("Ship Crit " + total + ": " + textCrit);
  }
  //Destiny Point Module
  if (message.content.toLowerCase().startsWith(config.prefix + "destiny")) {

    //Sets Denstiny balance per color
    if (params.includes("set")) {
      console.log("Setting current Destiny Balance for " + message.author.username);

      for (var i = 0; i < params.length; i++) {

        if (params[i].endsWith("l")) {
          destinyBalance.light = extractNumbers(params[i]);
        }

        if (params[i].endsWith("d")) {
          destinyBalance.dark = extractNumbers(params[i]);
        }
      }
    }
    //Reset the Destiny pool
    if (params.includes("reset")) {
      console.log(message.author.username + " resets the Destiny Pool");
      destinyBalance.light = 0;
      destinyBalance.dark = 0;
      destinyBalance.face = "";
      message.channel.sendMessage(message.author.username + " resets the Destiny Pool");
    }

    //Use a lightside from the Destiny pool
    if (params.includes("light")) {
      if (destinyBalance.light <= 0) {
        message.channel.sendMessage("No lightside points available, request will be ignored");
      } else {
        console.log(message.author.username + " uses a Lightside point");
        destinyBalance.light--;
        destinyBalance.dark++;
        message.channel.sendMessage(message.author.username + " uses a Lightside point");
      }
    }

    //Use a darkside from the Destiny pool
    if (params.includes("dark")) {
      if (destinyBalance.dark <= 0) {
        message.channel.sendMessage("No Darkside points available, request will be ignored");
      } else {
        console.log(message.author.username + " uses a Darkside point");
        destinyBalance.dark--;
        destinyBalance.light++;
        message.channel.sendMessage(message.author.username + " uses a Darkside point");
      }
    }

    //Prints out destiny pool to channel
    destinyBalance.face = "";
    for (var i = 1; i <= destinyBalance.light; i++) {
      destinyBalance.face += print.ls;
    }
    for (var i = 1; i <= destinyBalance.dark; i++) {
      destinyBalance.face += print.ds;
    }
    message.channel.sendMessage("Destiny Pool: ");
    message.channel.sendMessage(destinyBalance.face);
  }

  // Roll the dice command
  if (message.content.toLowerCase().startsWith(config.prefix + "roll")) {
    console.log("Rolling dice for " + message.author.username);
    /*Sorting the dice types by suffix
    7 unique dice in total
    y = Yellow
    g = Green
    b = Blue
    blk = Black
    r = red
    p = Purple
    d/w = destiny/white
    */


    //check off colors as they are rolled to make sure users don't accidentally roll duplicates
    var yellowRolled = false;
    var greenRolled = false;
    var blueRolled = false;
    var blackRolled = false;
    var redRolled = false;
    var purpleRolled = false;
    var whiteRolled = false;

    //Init the dice results to zero
    var diceResult = {
      success: 0,
      failure: 0,
      advantage: 0,
      threat: 0,
      triumph: 0,
      despair: 0,
      light: 0,
      dark: 0,
      face: "",
    };

    //Switch to abort command if ever turns true
    var abandonShip = false;

    //init the descriptor string to an empty string
    var desc = "";

    //var descArr = [];
    var beg, end = 0;
    var begF, endF = false;
    for (var i = 0; i < params.length; i++) {
      if (params[i].includes('"')) {
        if (!begF) {
          beg = i;
          begF = true;
        } else if (begF && !endF) {
          end = i;
          endF = true;
        }
      }
    }

    console.log("Beg: " + beg + " End: " + end);
    for (i = beg; i < end + 1; i++) {
      console.log(params[i]);
      desc += " " + params[i];
    }

    var spliceAmnt = end + 1 - beg;

    //remove the text field arguments from the list of parameters before checking for dice.
    params.splice(beg, spliceAmnt);

    //Iterate over the parameters and call the dice roll functions respective to color
    // this allows users to list dice colors in any order
    for (var i = 0; i < params.length; i++) {
      if (abandonShip) break;
      //Begin checking for any dice rolls

      /*
        NOTE: made redundant by update version 1.0.2

        Given that dice rolls must be between 1-99 and the suffix with the most chars is "blk" we must only check for
        arguments that are equal or less than 5 chars. Example !roll 99blk  has 5 chars in the dice argument.
        This allows dynamic dice argument order in conjunction with a string descriptor, but requires string descriptors
        to be greater than 5 characters.
      */
      if (params[i].length <= 5) {
        //check command for yellow dice roll
        if (params[i].endsWith("y")) {
          //make sure they haven't already rolled these dice
          if (yellowRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.black.bgYellow("yellow") + " dice rolls"));
          } else if (yellowRolled == false) {
            yellowRolled = true;
            //Extract the number of dice to roll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Proficiency Dice.");

            //Call the function that rolls the yellow dice

            var yellowResult = rollYellow(diceQty);


            //Add the result of all the yellow dice rolls to the standing count
            for (var k in yellowResult) {
              diceResult[k] += yellowResult[k];
            }

          }
        }
        //check command for green dice roll
        if (params[i].endsWith("g")) {
          //make sure they haven't already rolled these dice
          if (greenRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgGreen("green") + " dice rolls"));
          } else if (greenRolled == false) {
            greenRolled = true;
            //Extract the number of dice to roll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Ability Dice.");

            //Call the function that rolls the green dice
            var greenResult = rollGreen(diceQty);


            //Add the result of all the green dice rolls to the standing count
            for (var k in greenResult) {
              diceResult[k] += greenResult[k];
            }

          }
        }
        //check command for Blue dice roll
        if (params[i].endsWith("b")) {
          //make sure they haven't already rolled these dice
          if (blueRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgBlue("blue") + " dice rolls"));
          } else if (blueRolled == false) {
            blueRolled = true;

            //Extract the number of dice to troll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Boost Dice.");

            //Call the function that rolls the blue dice
            var blueResult = rollBlue(diceQty);

            //Add the result of all the blue dice rolls to the standing count
            for (var k in blueResult) {
              diceResult[k] += blueResult[k];
            }
          }
        }

        //check command for Black dice roll
        if (params[i].endsWith("blk")) {
          //make sure they haven't already rolled these dice
          if (blackRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgBlack("black") + " dice rolls"));
          } else if (blackRolled == false) {
            blackRolled = true;
            //Extract the number of dice to troll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Setback Dice.");

            //Call the function that rolls the black dice
            var blackResult = rollBlack(diceQty);

            //Add the result of all the black dice rolls to the standing count
            for (var k in blackResult) {
              diceResult[k] += blackResult[k];
            }
          }
        }

        //check command for red dice roll
        if (params[i].endsWith("r")) {
          //make sure they haven't already rolled these dice
          if (redRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.black.bgRed("red") + " dice rolls"));
          } else if (redRolled == false) {
            redRolled = true;

            //Extract the number of dice to troll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Challenge Dice.");

            //Call the function that rolls the red dice
            var redResult = rollRed(diceQty);

            //Add the result of all the red dice rolls to the standing count
            for (var k in redResult) {
              diceResult[k] += redResult[k];
            }
          }
        }
        //check command for Purple dice roll
        if (params[i].endsWith("p")) {
          //make sure they haven't already rolled these dice
          if (purpleRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgMagenta("purple") + " dice rolls"));
          } else if (purpleRolled == false) {
            purpleRolled = true;
            //Extract the number of dice to troll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Difficulty Dice.");

            //Call the function that rolls the purple dice
            var purpleResult = rollPurple(diceQty);

            //Add the result of all the purple dice rolls to the standing count
            for (var k in purpleResult) {
              diceResult[k] += purpleResult[k];
            }
          }
        }
        //check command for destiny/white dice roll
        if (params[i].endsWith("d") || params[i].endsWith("w")) {
          //make sure they haven't already rolled these dice
          if (whiteRolled == true) {
            message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
            console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.black.bgWhite("white") + " dice rolls"));
          } else if (whiteRolled == false) {
            whiteRolled = true;

            //Extract the number of dice to troll from the string
            var diceQty = extractNumbers(params[i]);
            if (diceQty > config.maxRollsPerDie) {
              abandonShip = true;
              break;
            }

            console.log("Rolling " + diceQty + " Destiny Dice.");

            //Call the function that rolls the white dice
            var whiteResult = rollWhite(diceQty);

            //Add the result of all the white dice rolls to the standing count
            for (var k in whiteResult) {
              diceResult[k] += whiteResult[k];
            }
          }
        }
      }
    } //end of For loop

    console.log("\nThe Standing Count is");
    console.log(diceResult);

    //BEGIN PREPARING THE MESSAGE TO SEND

    var cancelledDiceResult = {
      success: 0,
      failure: 0,
      advantage: 0,
      threat: 0,
      triumph: 0,
      despair: 0,
      light: 0,
      dark: 0
    };


    //Extract the descriptor from the command assuming it's the only param greater than 5 chars
    //Poetnetially obsolete
    for (var i = 0; i < params.length; i++) {
      if (params[i].length > 5) {
        desc = params[i];
        break;
      }
    }

    //Do the cancellations
    if (!abandonShip) {

      //remove Quotes from descriptor
      desc = desc.replace(/['"]+/g, '');

      var response = "";

      //cancel success/failures
      if (diceResult.success > diceResult.failure) {
        var successRemaining = diceResult.success - diceResult.failure;
        cancelledDiceResult.success = successRemaining;
        response += "   " + print.suc + successRemaining;
      } else if (diceResult.success < diceResult.failure) {
        var failureRemaining = diceResult.failure - diceResult.success;
        cancelledDiceResult.failure = failureRemaining;
        response += "   " + print.fail + failureRemaining;
      }

      //cancel Advantage/Threat
      if (diceResult.advantage > diceResult.threat) {
        var advantageRemaining = diceResult.advantage - diceResult.threat;
        cancelledDiceResult.advantage = advantageRemaining;
        response += "   " + print.adv + advantageRemaining;
      } else if (diceResult.advantage < diceResult.threat) {
        var threatRemaining = diceResult.threat - diceResult.advantage;
        cancelledDiceResult.threat = threatRemaining;
        response += "   " + print.thr + threatRemaining;
      }
      //Check for any Triumphs
      if (diceResult.triumph != 0) {
        cancelledDiceResult.triumph = diceResult.triumph;
        response += "   " + print.tri + diceResult.triumph;
      }
      //Check for any Despair
      if (diceResult.despair != 0) {
        cancelledDiceResult.despair = diceResult.despair;
        response += "   " + print.des + diceResult.despair;
      }

      //check for force
      if (diceResult.light != 0) {
        response += "   " + print.ls + diceResult.light;
      }

      if (diceResult.dark != 0) {
        response += "   " + print.ds + diceResult.dark;
      }

      message.channel.sendMessage(message.author.username + " roll results: " + config.descriptorPrepend + " " + desc);
      message.channel.sendMessage(diceResult.face);
      message.channel.sendMessage("Final results: " + response);

    } else if (abandonShip) {
      message.reply("Roll exceeds max roll per die limit of " + config.maxRollsPerDie + " . Please try again.");
    }
  }
});

//Function for extracting the number of times to roll a dice from the command string
function extractNumbers(str) {
  var num = str.replace(/\D/g, "");
  return num;
}

//Function that generates random numbers based on varying dice sizes
function randomInteger(num) {
  var result = Math.floor(Math.random() * num) + 1;
  return result;
}

function rollBlue(diceQty) {
  //Blue "Boost" die (d6)
  //1 Blank
  //2 Blank
  //3 Success
  //4 Advantage
  //5 Advantage + Advantage
  //6 Success + Advantage
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };

  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(6);
    //console.log(chalk.white.bgBlue("Dice landed on side " + roll));

    switch (roll) {
      case 1:
        console.log(chalk.white.bgBlue("Blank"));
        diceResult.face += print.bb;
        break;
      case 2:
        console.log(chalk.white.bgBlue("Blank"));
        diceResult.face += print.bb;
        break;
      case 3:
        console.log(chalk.white.bgBlue("Success"));
        diceResult.success = diceResult.success + 1;
        diceResult.face += print.bs;
        break;
      case 4:
        console.log(chalk.white.bgBlue("Advantage"));
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += print.ba;
        break;
      case 5:
        console.log(chalk.white.bgBlue("Advantage x2"));
        diceResult.advantage = diceResult.advantage + 2;
        diceResult.face += print.baa;
        break;
      case 6:
        console.log(chalk.white.bgBlue("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += print.bsa;
        break;
    }
  }
  return diceResult;
}

function rollGreen(diceQty) {
  //Green "Ability" die (d8)
  //1 Blank
  //2 Success
  //3 Success
  //4 Advantage
  //5 Advantage
  //6 Success + Advantage
  //7 Advantage + Advantage
  //8 Success + Success
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };

  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(8);


    switch (roll) {
      case 1:
        console.log(chalk.white.bgGreen("Blank"));
        diceResult.face += print.gb;
        break;
      case 2:
        console.log(chalk.white.bgGreen("Success"));
        diceResult.face += print.gs;
        diceResult.success = diceResult.success + 1;
        break;
      case 3:
        console.log(chalk.white.bgGreen("Success"));
        diceResult.face += print.gs;
        diceResult.success = diceResult.success + 1;
        break;
      case 4:
        console.log(chalk.white.bgGreen("Advantage"));
        diceResult.face += print.ga;
        diceResult.advantage = diceResult.advantage + 1;
        break;
      case 5:
        console.log(chalk.white.bgGreen("Advantage"));
        diceResult.face += print.ga;
        diceResult.advantage = diceResult.advantage + 1;
        break;
      case 6:
        console.log(chalk.white.bgGreen("Success + Advantage"));
        diceResult.face += print.gsa;
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        break;
      case 7:
        console.log(chalk.white.bgGreen("Advantage x2"));
        diceResult.face += print.gaa;
        diceResult.advantage = diceResult.advantage + 2;
        break;
      case 8:
        console.log(chalk.white.bgGreen("Success x2"));
        diceResult.face += print.gss;
        diceResult.success = diceResult.success + 2;
        break;
    }
  }
  return diceResult;
}
//
function rollYellow(diceQty) {
  //Yellow "Proficiency" die (d12)
  //1 Blank
  //2 success
  //3 success
  //4 success x2
  //5 success x2
  //6 advantage
  //7 success + advantage
  //8 success + advantage
  //9 success + advantage
  //10 advantage + advantage
  //11 advantage + advantage
  //12 triumph
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };

  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(12);


    switch (roll) {
      case 1:
        console.log(chalk.black.bgYellow("blank"));
        diceResult.face += print.yb;
        break;
      case 2:
        console.log(chalk.black.bgYellow("Success"));
        diceResult.success = diceResult.success + 1;
        diceResult.face += print.ys;
        break;
      case 3:
        console.log(chalk.black.bgYellow("Success"));
        diceResult.success = diceResult.success + 1;
        diceResult.face += print.ys;
        break;
      case 4:
        console.log(chalk.black.bgYellow("Success x2"));
        diceResult.success = diceResult.success + 2;
        diceResult.face += print.yss;
        break;
      case 5:
        console.log(chalk.black.bgYellow("Success x2"));
        diceResult.success = diceResult.success + 2;
        diceResult.face += print.yss;
        break;
      case 6:
        console.log(chalk.black.bgYellow("Advantage"));
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += print.ya;
        break;
      case 7:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += print.ysa;
        break;
      case 8:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += print.ysa;
        break;
      case 9:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += print.ysa;
        break;
      case 10:
        console.log(chalk.black.bgYellow("Advantage x2"));
        diceResult.advantage = diceResult.advantage + 2;
        diceResult.face += print.yaa;
        break;
      case 11:
        console.log(chalk.black.bgYellow("Advantage x2"));
        diceResult.advantage = diceResult.advantage + 2;
        diceResult.face += print.yaa;
        break;
      case 12:
        console.log(chalk.black.bgYellow("Triumph"));
        diceResult.triumph = diceResult.triumph + 1;
        diceResult.success = diceResult.success + 1;
        diceResult.face += print.yt;
        break;
    }
  }
  return diceResult;
}
//
function rollBlack(diceQty) {
  //Black "Setback" die (d6)
  //1 Blank
  //2 Blank
  //3 Failure
  //4 Failure
  //5 Threat
  //6 Threat
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };

  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(6);

    switch (roll) {
      case 1:
        console.log(chalk.white.bgBlack("Blank"));
        diceResult.face += print.blkb;
        break;
      case 2:
        console.log(chalk.white.bgBlack("Blank"));
        diceResult.face += print.blkb;
        break;
      case 3:
        console.log(chalk.white.bgBlack("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += print.blkf;
        break;
      case 4:
        console.log(chalk.white.bgBlack("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += print.blkf;
        break;
      case 5:
        console.log(chalk.white.bgBlack("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.blkt;
        break;
      case 6:
        console.log(chalk.white.bgBlack("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.blkt;
        break;
    }
  }
  return diceResult;
}
//
function rollPurple(diceQty) {
  //Purple "Difficulty" die (d8)
  //1 Blank
  //2 Failure
  //3 Failure x2
  //4 Threat
  //5 Threat
  //6 Threat
  //7 Threat + Threat
  //8 Failure + Threat
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };

  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(8);


    switch (roll) {
      case 1:
        console.log(chalk.white.bgMagenta("Blank"));
        diceResult.face += print.pb;
        break;
      case 2:
        console.log(chalk.white.bgMagenta("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += print.pf;
        break;
      case 3:
        console.log(chalk.white.bgMagenta("Failure x2"));
        diceResult.failure = diceResult.failure + 2;
        diceResult.face += print.pff;
        break;
      case 4:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.pt;
        break;
      case 5:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.pt;
        break;
      case 6:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.pt;
        break;
      case 7:
        console.log(chalk.white.bgMagenta("Threat x2"));
        diceResult.threat = diceResult.threat + 2;
        diceResult.face += print.ptt;
        break;
      case 8:
        console.log(chalk.white.bgMagenta("Failure + Threat"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.pft;
        break;
    }
  }
  return diceResult;
}
//
function rollRed(diceQty) {
  //Red "Challenge" die (d12)
  //1 Blank
  //2 Despair
  //3 Failure
  //4 Failure
  //5 Threat
  //6 Threat
  //7 Failure + Failure
  //8 Failure + Failure
  //9 Threat + Threat
  //10 Threat + Threat
  //11 Failure + Threat
  //12 Failure + Threat
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };


  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(12);


    switch (roll) {
      case 1:
        console.log(chalk.black.bgRed("Blank"));
        diceResult.face += print.rb;
        break;
      case 2:
        console.log(chalk.black.bgRed("Despair"));
        diceResult.despair = diceResult.despair + 1;
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += print.rd;
        break;
      case 3:
        console.log(chalk.black.bgRed("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += print.rf;
        break;
      case 4:
        console.log(chalk.black.bgRed("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += print.rf;
        break;
      case 5:
        console.log(chalk.black.bgRed("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.rt;
        break;
      case 6:
        console.log(chalk.black.bgRed("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.rt;
        break;
      case 7:
        console.log(chalk.black.bgRed("Failure x2"));
        diceResult.failure = diceResult.failure + 2;
        diceResult.face += print.rff;
        break;
      case 8:
        console.log(chalk.black.bgRed("Failure x2"));
        diceResult.failure = diceResult.failure + 2;
        diceResult.face += print.rff;
        break;
      case 9:
        console.log(chalk.black.bgRed("Threat x2"));
        diceResult.threat = diceResult.threat + 2;
        diceResult.face += print.rtt;
        break;
      case 10:
        console.log(chalk.black.bgRed("Threat x2"));
        diceResult.threat = diceResult.threat + 2;
        diceResult.face += print.rtt;
        break;
      case 11:
        console.log(chalk.black.bgRed("Failure + Threat"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.rft;
        break;
      case 12:
        console.log(chalk.black.bgRed("Failure + Threat"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += print.rft;
        break;
    }
  }
  return diceResult;
}
//
function rollWhite(diceQty) {
  //White "Force" die (d12)
  //1 Light
  //2 Light
  //3 Light + Light
  //4 Light + Light
  //5 Light + Light
  //6 Dark
  //7 Dark
  //8 Dark
  //9 Dark
  //10 Dark
  //11 Dark
  //12 Dark + Dark
  var roll = 0;
  var diceResult = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: ""
  };


  for (var i = 1; i <= diceQty; i++) {

    roll = randomInteger(12);


    switch (roll) {
      case 1:
        console.log(chalk.black.bgWhite("Light"));
        diceResult.light = diceResult.light + 1;
        diceResult.face += print.wl;
        break;
      case 2:
        console.log(chalk.black.bgWhite("Light"));
        diceResult.light = diceResult.light + 1;
        diceResult.face += print.wl;
        break;
      case 3:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult.light = diceResult.light + 2;
        diceResult.face += print.wll;
        break;
      case 4:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult.light = diceResult.light + 2;
        diceResult.face += print.wll;
        break;
      case 5:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult.light = diceResult.light + 2;
        diceResult.face += print.wll;
        break;
      case 6:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += print.wd;
        break;
      case 7:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += print.wd;
        break;
      case 8:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += print.wd;
        break;
      case 9:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += print.wd;
        break;
      case 10:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += print.wd;
        break;
      case 11:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += print.wd;
        break;
      case 12:
        console.log(chalk.black.bgWhite("Dark x2"));
        diceResult.dark = diceResult.dark + 2;
        diceResult.face += print.wdd;
        break;
    }
  }
  return diceResult;
}
