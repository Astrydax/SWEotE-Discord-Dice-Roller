/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/

const Discord = require("discord.js");
const config = require("./config.json");
var chalk = require("chalk");
const bot = new Discord.Client();
bot.login(config.token);

var version = "1.0.3";
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
  if (message.content.startsWith(config.prefix + "d100")) {
    let r = Math.floor(Math.random() * 100) + 1;
    message.reply(" rolled: " + r);
  }
  
//Destiny Point Module
if (message.content.startsWith(config.prefix + "destiny")) {
    
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
        if (destinyBalance.light == 0){
        message.channel.sendMessage("No lightside points available, request will be ignored");
        }
        else {
        console.log(message.author.username + " uses a Lightside point");
        destinyBalance.light--;
        destinyBalance.dark++;
        message.channel.sendMessage(message.author.username + " uses a Lightside point");
        }
    }
    
    //Use a darkside from the Destiny pool
    if (params.includes("dark")) {
        if (destinyBalance.dark == 0){
        message.channel.sendMessage("No Darkside points available, request will be ignored");
        }
        else {
        console.log(message.author.username + " uses a Darkside point");
        destinyBalance.dark--;
        destinyBalance.light++;
        message.channel.sendMessage(message.author.username + " uses a Darkside point");
        }
    }
    
	//Prints out destiny pool to channel
	destinyBalance.face = "";	
		for (var i = 1; i <= destinyBalance.light; i++) {
    	destinyBalance.face += "<:ls:294221000504246283>";
    	}
		for (var i = 1; i <= destinyBalance.dark; i++) {
    	destinyBalance.face += "<:ds:294221001015689217>";
  		}
	message.channel.sendMessage("Destiny Pool: "); 
	message.channel.sendMessage(destinyBalance.face);
}
  
  // Roll the dice command
  if (message.content.startsWith(config.prefix + "roll")) {
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
        response += "   " + "<:suc:294221000814493696> " + successRemaining;
      } else if (diceResult.success < diceResult.failure) {
        var failureRemaining = diceResult.failure - diceResult.success;
        cancelledDiceResult.failure = failureRemaining;
        response += "   " + "<:fail:294221000634007553> " + failureRemaining;
      }

      //cancel Advantage/Threat
      if (diceResult.advantage > diceResult.threat) {
        var advantageRemaining = diceResult.advantage - diceResult.threat;
        cancelledDiceResult.advantage = advantageRemaining;
        response += "   " + "<:adv:294221000277491714> " + advantageRemaining;
      } else if (diceResult.advantage < diceResult.threat) {
        var threatRemaining = diceResult.threat - diceResult.advantage;
        cancelledDiceResult.threat = threatRemaining;
        response += "   " + "<:thr:294221000684470274> " + threatRemaining;
      }
      //Check for any Triumphs
      if (diceResult.triumph != 0) {
        cancelledDiceResult.triumph = diceResult.triumph;
        response += "   " + "<:tri:294221000713830401> " + diceResult.triumph;
      }
      //Check for any Despair
      if (diceResult.despair != 0) {
        cancelledDiceResult.despair = diceResult.despair;
        response += "   " + "<:des:294221000911093760> " + diceResult.despair;
      }

      //check for force
      if (diceResult.light != 0) {
        response += "   " + "<:ls:294221000504246283> " + diceResult.light;
      }

      if (diceResult.dark != 0) {
        response += "   " + "<:ds:294221001015689217> " + diceResult.dark;
      }

      message.channel.sendMessage(message.author.username + " roll results:" + desc);
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
        diceResult.face += "<:bb:294475842799665152> ";
        break;
      case 2:
        console.log(chalk.white.bgBlue("Blank"));
        diceResult.face += "<:bb:294475842799665152> ";
        break;
      case 3:
        console.log(chalk.white.bgBlue("Success"));
        diceResult.success = diceResult.success + 1;
        diceResult.face += "<:bs:294475842812248064> ";
        break;
      case 4:
        console.log(chalk.white.bgBlue("Advantage"));
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += "<:ba:294475842778693633> ";
        break;
      case 5:
        console.log(chalk.white.bgBlue("Advantage x2"));
        diceResult.advantage = diceResult.advantage + 2;
        diceResult.face += "<:baa:294475841453162506> ";
        break;
      case 6:
        console.log(chalk.white.bgBlue("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += "<:bsa:294475842803728384> ";
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
        diceResult.face += "<:gb:294232171286364161> ";
        break;
      case 2:
        console.log(chalk.white.bgGreen("Success"));
        diceResult.face += "<:gs:294232171840012288> ";
        diceResult.success = diceResult.success + 1;
        break;
      case 3:
        console.log(chalk.white.bgGreen("Success"));
        diceResult.face += "<:gs:294232171840012288> ";
        diceResult.success = diceResult.success + 1;
        break;
      case 4:
        console.log(chalk.white.bgGreen("Advantage"));        
        diceResult.face += "<:ga:294232171131043851> ";
        diceResult.advantage = diceResult.advantage + 1;
        break;
      case 5:
        console.log(chalk.white.bgGreen("Advantage"));
        diceResult.face += "<:ga:294232171131043851> ";
        diceResult.advantage = diceResult.advantage + 1;
        break;
      case 6:
        console.log(chalk.white.bgGreen("Success + Advantage"));
        diceResult.face += "<:gsa:294232171688886273> ";
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        break;
      case 7:
        console.log(chalk.white.bgGreen("Advantage x2"));
        diceResult.face += "<:gaa:294232171369988096> ";
        diceResult.advantage = diceResult.advantage + 2;
        break;
      case 8:
        console.log(chalk.white.bgGreen("Success x2"));
        diceResult.face += "<:gss:294232171907121162> ";
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
        diceResult.face += "<:yb:294475842581692417> ";
        break;
      case 2:
        console.log(chalk.black.bgYellow("Success"));
        diceResult.success = diceResult.success + 1;
        diceResult.face += "<:ys:294475842506194946> ";
        break;
      case 3:
        console.log(chalk.black.bgYellow("Success"));
        diceResult.success = diceResult.success + 1;
        diceResult.face += "<:ys:294475842506194946> ";
        break;
      case 4:
        console.log(chalk.black.bgYellow("Success x2"));
        diceResult.success = diceResult.success + 2;
        diceResult.face += "<:yss:294475842573303809> ";
        break;
      case 5:
        console.log(chalk.black.bgYellow("Success x2"));
        diceResult.success = diceResult.success + 2;
        diceResult.face += "<:yss:294475842573303809> ";
        break;
      case 6:
        console.log(chalk.black.bgYellow("Advantage"));
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += "<:ya:294475842602532866> ";
        break;
      case 7:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += "<:ysa:294475842854322177> ";
        break;
      case 8:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += "<:ysa:294475842854322177> ";
        break;
      case 9:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult.success = diceResult.success + 1;
        diceResult.advantage = diceResult.advantage + 1;
        diceResult.face += "<:ysa:294475842854322177> ";
        break;
      case 10:
        console.log(chalk.black.bgYellow("Advantage x2"));
        diceResult.advantage = diceResult.advantage + 2;
        diceResult.face += "<:yaa:294475842699132930> ";
        break;
      case 11:
        console.log(chalk.black.bgYellow("Advantage x2"));
        diceResult.advantage = diceResult.advantage + 2;
        diceResult.face += "<:yaa:294475842699132930> ";
        break;
      case 12:
        console.log(chalk.black.bgYellow("Triumph"));
        diceResult.triumph = diceResult.triumph + 1;
        diceResult.success = diceResult.success + 1;
        diceResult.face += "<:yt:294475842812248074> ";
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
        diceResult.face += "<:blkb:294475842757722113> ";
        break;
      case 2:
        console.log(chalk.white.bgBlack("Blank"));
        diceResult.face += "<:blkb:294475842757722113> ";
        break;
      case 3:
        console.log(chalk.white.bgBlack("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += "<:blkf:294475839171461121> ";
        break;
      case 4:
        console.log(chalk.white.bgBlack("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += "<:blkf:294475839171461121> ";
        break;
      case 5:
        console.log(chalk.white.bgBlack("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:blkt:294475842615115777> ";
        break;
      case 6:
        console.log(chalk.white.bgBlack("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:blkt:294475842615115777> ";
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
        diceResult.face += "<:pb:294238724043309057> ";
        break;
      case 2:
        console.log(chalk.white.bgMagenta("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += "<:pf:294238724659740673> ";
        break;
      case 3:
        console.log(chalk.white.bgMagenta("Failure x2"));
        diceResult.failure = diceResult.failure + 2;
        diceResult.face += "<:pff:294238724638900224> ";
        break;
      case 4:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:pt:294238723837788172> ";
        break;
      case 5:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:pt:294238723837788172> ";
        break;
      case 6:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:pt:294238723837788172> ";
        break;
      case 7:
        console.log(chalk.white.bgMagenta("Threat x2"));
        diceResult.threat = diceResult.threat + 2;
        diceResult.face += "<:ptt:294238724680581120> ";
        break;
      case 8:
        console.log(chalk.white.bgMagenta("Failure + Threat"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:pft:294238724621860874> ";
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
        diceResult.face += "<:rb:294475842803859466> ";
        break;
      case 2:
        console.log(chalk.black.bgRed("Despair"));
        diceResult.despair = diceResult.despair + 1;
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += "<:rd:294475839305678848> ";
        break;
      case 3:
        console.log(chalk.black.bgRed("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += "<:rf:294475842501738498> ";
        break;
      case 4:
        console.log(chalk.black.bgRed("Failure"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.face += "<:rf:294475842501738498> ";
        break;
      case 5:
        console.log(chalk.black.bgRed("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:rt:294475842564653057> ";
        break;
      case 6:
        console.log(chalk.black.bgRed("Threat"));
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:rt:294475842564653057> ";
        break;
      case 7:
        console.log(chalk.black.bgRed("Failure x2"));
        diceResult.failure = diceResult.failure + 2;
        diceResult.face += "<:rff:294475842426503171> ";
        break;
      case 8:
        console.log(chalk.black.bgRed("Failure x2"));
        diceResult.failure = diceResult.failure + 2;
        diceResult.face += "<:rff:294475842426503171> ";
        break;
      case 9:
        console.log(chalk.black.bgRed("Threat x2"));
        diceResult.threat = diceResult.threat + 2;
        diceResult.face += "<:rtt:294475842346811394> ";
        break;
      case 10:
        console.log(chalk.black.bgRed("Threat x2"));
        diceResult.threat = diceResult.threat + 2;
        diceResult.face += "<:rtt:294475842346811394> ";
        break;
      case 11:
        console.log(chalk.black.bgRed("Failure + Threat"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:rft:294475842833219585> ";
        break;
      case 12:
        console.log(chalk.black.bgRed("Failure + Threat"));
        diceResult.failure = diceResult.failure + 1;
        diceResult.threat = diceResult.threat + 1;
        diceResult.face += "<:rft:294475842833219585> ";
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
        diceResult.face += "<:wl:294661335310925834> ";
        break;
      case 2:
        console.log(chalk.black.bgWhite("Light"));
        diceResult.light = diceResult.light + 1;
        diceResult.face += "<:wl:294661335310925834> ";
        break;
      case 3:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult.light = diceResult.light + 2;
        diceResult.face += "<:wll:294661335155867650> ";
        break;
      case 4:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult.light = diceResult.light + 2;
        diceResult.face += "<:wll:294661335155867650> ";
        break;
      case 5:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult.light = diceResult.light + 2;
        diceResult.face += "<:wll:294661335155867650> ";
        break;
      case 6:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += "<:wd:294661334971187200> ";
        break;
      case 7:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += "<:wd:294661334971187200> ";
        break;
      case 8:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += "<:wd:294661334971187200> ";
        break;
      case 9:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += "<:wd:294661334971187200> ";
        break;
      case 10:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += "<:wd:294661334971187200> ";
        break;
      case 11:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult.dark = diceResult.dark + 1;
        diceResult.face += "<:wd:294661334971187200> ";
        break;
      case 12:
        console.log(chalk.black.bgWhite("Dark x2"));
        diceResult.dark = diceResult.dark + 2;
        diceResult.face += "<:wdd:294661335243816960> ";
        break;
    }
  }
  return diceResult;
}