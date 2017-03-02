/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please visit me on fiverr at
  https://www.fiverr.com/royalcrown28
*/

const Discord = require("discord.js");
const config = require("./config.json");
var chalk = require("chalk");
const bot = new Discord.Client();
bot.login(config.token);

var version = "1.0.2";


//Called When bot becomes functional.
bot.on("ready", () => {
  console.log(`Bot version ${version}`);
  console.log(`Logged in as ${bot.user.username}!`);
  if(config.maxRollsPerDie >= 100){
    console.warn(chalk.white.bgRed("!!!WARNING!!! maxRollsPerDie in config.json must be set between 1-99 otherwise errors may occur in rolls"));
  }
  //console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
});

//Called whenever a users send a message to the server
bot.on("message", message => {
  //Ignore messages sent by the bot
  if(message.author.bot) return;

  //Ignore messages that dont start with the command symbol
  if(!message.content.startsWith(config.prefix)) return;

  //Seperate and create a list of parameters. A space in the message denotes a new parameter
  const params = message.content.split(" ").slice(1);

  //************************COMMANDS START HERE************************

  // Command to kill the bot application
  // if(message.content.startsWith(config.prefix + "kill")){
  //   console.log("!kill command was called... Now Exiting");
  //   process.exit();
  // }

  // Roll the dice command
  if(message.content.startsWith(config.prefix + "roll")){
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
      success : 0,
      failure : 0,
      advantage : 0,
      threat : 0,
      triumph : 0,
      despair : 0,
      light : 0,
      dark : 0
    };

    //Switch to abort command if ever turns true
    var abandonShip = false;

    //init the descriptor string to an empty string
    var desc = "";

    //var descArr = [];
    var beg, end = 0;
    var begF, endF = false;
    for(var i = 0; i< params.length; i++){
      if(params[i].includes('"')){
        if(!begF){
          beg = i;
          begF = true;
        }else if(begF && !endF){
          end = i;
          endF = true;
        }
      }
    }

    console.log("Beg: " + beg + " End: " + end);
    for(i = beg; i < end + 1; i++){
      console.log(params[i]);
      desc += " " + params[i];
    }

    spliceAmnt = end + 1 - beg;

    //remove the text field arguments from the list of parameters before checking for dice.
    params.splice(beg, spliceAmnt);




    //Iterate over the parameters and call the dice roll functions respective to color
    // this allows users to list dice colors in any order
    for(var i = 0; i< params.length; i++){
      if(abandonShip) break;
      //Begin checking for any dice rolls

      /*
        NOTE: made redundant by update version 1.0.2

        Given that dice rolls must be between 1-99 and the suffix with the most chars is "blk" we must only check for
        arguments that are equal or less than 5 chars. Example !roll 99blk  has 5 chars in the dice argument.
        This allows dynamic dice argument order in conjunction with a string descriptor, but requires string descriptors
        to be greater than 5 characters.
      */
      if(params[i].length <= 5){
      //check command for yellow dice roll
      if(params[i].endsWith("y")){
        //make sure they haven't already rolled these dice
        if(yellowRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.black.bgYellow("yellow") + " dice rolls"));
        }else if (yellowRolled == false) {
          yellowRolled = true;
          //Extract the number of dice to roll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Proficiency Dice.");

          //Call the function that rolls the yellow dice

            var yellowResult = rollYellow(diceQty);


          //Add the result of all the yellow dice rolls to the standing count
          for(var k in yellowResult){
            diceResult[k] += yellowResult[k];
          }

        }
      }
      //check command for green dice roll
      if(params[i].endsWith("g")){
        //make sure they haven't already rolled these dice
        if(greenRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgGreen("green") + " dice rolls"));
        }else if (greenRolled == false) {
          greenRolled = true;
          //Extract the number of dice to roll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Ability Dice.");

          //Call the function that rolls the green dice
          var greenResult = rollGreen(diceQty);

          //Add the result of all the green dice rolls to the standing count
          for(var k in greenResult){
            diceResult[k] += greenResult[k];
          }

        }
      }
      //check command for Blue dice roll
      if(params[i].endsWith("b")){
        //make sure they haven't already rolled these dice
        if(blueRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgBlue("blue") + " dice rolls"));
        }else if (blueRolled == false) {
          blueRolled = true;

          //Extract the number of dice to troll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Boost Dice.");

          //Call the function that rolls the blue dice
          var blueResult = rollBlue(diceQty);

          //Add the result of all the blue dice rolls to the standing count
          for(var k in blueResult){
            diceResult[k] += blueResult[k];
          }
        }
      }

      //check command for Black dice roll
      if(params[i].endsWith("blk")){
        //make sure they haven't already rolled these dice
        if(blackRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgBlack("black") + " dice rolls"));
        }else if (blackRolled == false) {
          blackRolled = true;
          //Extract the number of dice to troll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Setback Dice.");

          //Call the function that rolls the black dice
          var blackResult = rollBlack(diceQty);

          //Add the result of all the black dice rolls to the standing count
          for(var k in blackResult){
            diceResult[k] += blackResult[k];
          }
        }
      }

      //check command for red dice roll
      if(params[i].endsWith("r")){
        //make sure they haven't already rolled these dice
        if(redRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.black.bgRed("red") + " dice rolls"));
        }else if (redRolled == false) {
          redRolled = true;

          //Extract the number of dice to troll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Challenge Dice.");

          //Call the function that rolls the red dice
          var redResult = rollRed(diceQty);

          //Add the result of all the red dice rolls to the standing count
          for(var k in redResult){
            diceResult[k] += redResult[k];
          }
        }
      }
      //check command for Purple dice roll
      if(params[i].endsWith("p")){
        //make sure they haven't already rolled these dice
        if(purpleRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.white.bgMagenta("purple") + " dice rolls"));
        }else if (purpleRolled == false) {
          purpleRolled = true;
          //Extract the number of dice to troll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Difficulty Dice.");

          //Call the function that rolls the purple dice
          var purpleResult = rollPurple(diceQty);

          //Add the result of all the purple dice rolls to the standing count
          for(var k in purpleResult){
            diceResult[k] += purpleResult[k];
          }
        }
      }
      //check command for destiny/white dice roll
      if(params[i].endsWith("d") || params[i].endsWith("w")){
        //make sure they haven't already rolled these dice
        if(whiteRolled == true){
          message.channel.sendMessage("Duplicate dice argument detected. The roll " + params[i] + " will be ignored");
          console.log(chalk.white.bgRed("User error, tried to call multiple " + chalk.black.bgWhite("white") + " dice rolls"));
        }else if (whiteRolled == false) {
          whiteRolled = true;

          //Extract the number of dice to troll from the string
          var diceQty = extractNumbers(params[i]);
          if(diceQty > config.maxRollsPerDie){
            abandonShip = true;
            break;
          }

          console.log("Rolling " + diceQty + " Destiny Dice.");

          //Call the function that rolls the white dice
          var whiteResult = rollWhite(diceQty);

          //Add the result of all the white dice rolls to the standing count
          for(var k in whiteResult){
            diceResult[k] += whiteResult[k];
          }
        }
      }
    }
    }//end of For loop

    console.log("\nThe Standing Count is");
    console.log(diceResult);

    //BEGIN PREPARING THE MESSAGE TO SEND


    //Extract the descriptor from the command assuming it's the only param greater than 5 chars
    for(var i = 0; i < params.length; i++){
      if(params[i].length > 5){
        desc = params[i];
        break;
      }
    }


    //Do the cancellations
    if(!abandonShip){

      var response = message.author.username + " roll results: ";

      //cancel success/failures
      if(diceResult.success > diceResult.failure ){
        var successRemaining = diceResult.success - diceResult.failure;
        response += "   " + "Success: " + successRemaining;
      }else if(diceResult.success < diceResult.failure ){
        var failureRemaining = diceResult.failure - diceResult.success;
        response += "   " + "Failure: " + failureRemaining;
      }

      //cancel Advantage/Threat
      if(diceResult.advantage > diceResult.threat ){
        var advantageRemaining = diceResult.advantage - diceResult.threat;
        response += "   " + "Advantage: " + advantageRemaining;
      }else if(diceResult.advantage < diceResult.threat ){
        var threatRemaining = diceResult.threat - diceResult.advantage;
        response += "   " + "Threat: " + threatRemaining;
      }
      //Check for any Triumphs
      if(diceResult.triumph != 0){
        response += "   " + "Triumph: " + diceResult.triumph;
      }
      //Check for any Despair
      if(diceResult.despair != 0){
        response += "   " + "Despair: " + diceResult.despair;
      }

      //check for force
      if(diceResult.light != 0 || diceResult.dark != 0){
        if(diceResult.light > diceResult.dark ){
          var lightRemaining = diceResult.light - diceResult.dark;
          response += "   " + "Light Force: " + lightRemaining;
        }else if(diceResult.light < diceResult.dark ){
          var darkRemaining = diceResult.dark - diceResult.light;
          response += "   " + "Dark Force: " + darkRemaining;
        }
      }

      //remove Quotes from descriptor
      desc = desc.replace(/['"]+/g, '');

      //response += " " + desc;
      message.channel.sendMessage(config.descriptorPrepend + " " + desc + "\n" + response);
      //message.channel.sendMessage(response);
    }else if (abandonShip) {
      message.reply("Roll exceeds max roll per die limit of " + config.maxRollsPerDie + " . Please try again.");
    }
  }
});

//Function for extracting the number of times to roll a dice from the command string
function extractNumbers(str){
  var num = str.replace(/\D/g,"");
  return num;
}

//Function that generates random numbers based on varying dice sizes
function randomInteger(num){
  var result = Math.floor(Math.random() * num) + 1;
  return result;
}



function rollBlue(diceQty){
  //Blue "Boost" die (d6)
  //1 Blank
  //2 Blank
  //3 Success
  //4 Advantage
  //5 Advantage + Advantage
  //6 Success + Advantage
  var roll = 0;
  var diceResult = {
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };

  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(6);
    //console.log(chalk.white.bgBlue("Dice landed on side " + roll));

    switch(roll) {
    case 1:
      console.log(chalk.white.bgBlue("Blank"));
      break;
    case 2:
      console.log(chalk.white.bgBlue("Blank"));
      break;
    case 3:
      console.log(chalk.white.bgBlue("Success"));
      diceResult.success = diceResult.success + 1;
      break;
    case 4:
      console.log(chalk.white.bgBlue("Advantage"));
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 5:
      console.log(chalk.white.bgBlue("Advantage x2"));
      diceResult.advantage = diceResult.advantage + 2;
      break;
    case 6:
      console.log(chalk.white.bgBlue("Success + Advantage"));
      diceResult.success = diceResult.success + 1;
      diceResult.advantage = diceResult.advantage + 1;
      break;
    }
  }
  return diceResult;
}

function rollGreen(diceQty){
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
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };

  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(8);


    switch(roll) {
    case 1:
      console.log(chalk.white.bgGreen("Blank"));
      break;
    case 2:
      console.log(chalk.white.bgGreen("Success"));
      diceResult.success = diceResult.success + 1;
      break;
    case 3:
      console.log(chalk.white.bgGreen("Success"));
      diceResult.success = diceResult.success + 1;
      break;
    case 4:
      console.log(chalk.white.bgGreen("Advantage"));
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 5:
      console.log(chalk.white.bgGreen("Advantage"));
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 6:
      console.log(chalk.white.bgGreen("Success + Advantage"));
      diceResult.success = diceResult.success + 1;
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 7:
      console.log(chalk.white.bgGreen("Advantage x2"));
      diceResult.advantage = diceResult.advantage + 2;
      break;
    case 8:
      console.log(chalk.white.bgGreen("Success x2"));
      diceResult.success = diceResult.success + 2;
      break;
    }
  }
  return diceResult;
}
//
function rollYellow(diceQty){
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
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };

  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(12);


    switch(roll) {
    case 1:
      console.log(chalk.black.bgYellow("blank"));
      break;
    case 2:
      console.log(chalk.black.bgYellow("Success"));
      diceResult.success = diceResult.success + 1;
      break;
    case 3:
      console.log(chalk.black.bgYellow("Success"));
      diceResult.success = diceResult.success + 1;
      break;
    case 4:
      console.log(chalk.black.bgYellow("Success x2"));
      diceResult.success = diceResult.success + 2;
      break;
    case 5:
      console.log(chalk.black.bgYellow("Success x2"));
      diceResult.success = diceResult.success + 2;
      break;
    case 6:
      console.log(chalk.black.bgYellow("Advantage"));
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 7:
      console.log(chalk.black.bgYellow("Success + Advantage"));
      diceResult.success = diceResult.success + 1;
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 8:
      console.log(chalk.black.bgYellow("Success + Advantage"));
      diceResult.success = diceResult.success + 1;
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 9:
      console.log(chalk.black.bgYellow("Success + Advantage"));
      diceResult.success = diceResult.success + 1;
      diceResult.advantage = diceResult.advantage + 1;
      break;
    case 10:
      console.log(chalk.black.bgYellow("Advantage x2"));
      diceResult.advantage = diceResult.advantage + 2;
      break;
    case 11:
      console.log(chalk.black.bgYellow("Advantage x2"));
      diceResult.advantage = diceResult.advantage + 2;
      break;
    case 12:
      console.log(chalk.black.bgYellow("Triumph"));
      diceResult.triumph = diceResult.triumph + 1;
      break;
    }
  }
  return diceResult;
}
//
function rollBlack(diceQty){
  //Black "Setback" die (d6)
  //1 Blank
  //2 Blank
  //3 Failure
  //4 Failure
  //5 Threat
  //6 Threat
  var roll = 0;
  var diceResult = {
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };

  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(6);

    switch(roll) {
    case 1:
      console.log(chalk.white.bgBlack("Blank"));
      break;
    case 2:
      console.log(chalk.white.bgBlack("Blank"));
      break;
    case 3:
      console.log(chalk.white.bgBlack("Failure"));
      diceResult.failure = diceResult.failure + 1;
      break;
    case 4:
      console.log(chalk.white.bgBlack("Failure"));
      diceResult.failure = diceResult.failure + 1;
      break;
    case 5:
      console.log(chalk.white.bgBlack("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    case 6:
      console.log(chalk.white.bgBlack("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    }
  }
  return diceResult;
}
//
function rollPurple(diceQty){
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
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };

  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(8);


    switch(roll) {
    case 1:
      console.log(chalk.white.bgMagenta("Blank"));
      break;
    case 2:
      console.log(chalk.white.bgMagenta("Failure"));
      diceResult.failure = diceResult.failure + 1;
      break;
    case 3:
      console.log(chalk.white.bgMagenta("Failure x2"));
      diceResult.failure = diceResult.failure + 2;
      break;
    case 4:
      console.log(chalk.white.bgMagenta("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    case 5:
      console.log(chalk.white.bgMagenta("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    case 6:
      console.log(chalk.white.bgMagenta("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    case 7:
      console.log(chalk.white.bgMagenta("Threat x2"));
      diceResult.threat = diceResult.threat + 2;
      break;
    case 8:
      console.log(chalk.white.bgMagenta("Failure + Threat"));
      diceResult.failure = diceResult.failure + 1;
      diceResult.threat = diceResult.threat + 1;
      break;
    }
  }
  return diceResult;
}
//
function rollRed(diceQty){
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
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };


  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(12);


    switch(roll) {
    case 1:
      console.log(chalk.black.bgRed("Blank"));
      break;
    case 2:
      console.log(chalk.black.bgRed("Despair"));
      diceResult.despair = diceResult.despair + 1;
      break;
    case 3:
      console.log(chalk.black.bgRed("Failure"));
      diceResult.failure = diceResult.failure + 1;
      break;
    case 4:
      console.log(chalk.black.bgRed("Failure"));
      diceResult.failure = diceResult.failure + 1;
      break;
    case 5:
      console.log(chalk.black.bgRed("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    case 6:
      console.log(chalk.black.bgRed("Threat"));
      diceResult.threat = diceResult.threat + 1;
      break;
    case 7:
      console.log(chalk.black.bgRed("Failure x2"));
      diceResult.failure = diceResult.failure + 2;
      break;
    case 8:
      console.log(chalk.black.bgRed("Failure x2"));
      diceResult.failure = diceResult.failure + 2;
      break;
    case 9:
      console.log(chalk.black.bgRed("Threat x2"));
      diceResult.threat = diceResult.threat + 2;
      break;
    case 10:
      console.log(chalk.black.bgRed("Threat x2"));
      diceResult.threat = diceResult.threat + 2;
      break;
    case 11:
      console.log(chalk.black.bgRed("Failure + Threat"));
      diceResult.failure = diceResult.failure + 1;
      diceResult.threat = diceResult.threat + 1;
      break;
    case 12:
      console.log(chalk.black.bgRed("Failure + Threat"));
      diceResult.failure = diceResult.failure + 1;
      diceResult.threat = diceResult.threat + 1;
      break;
    }
  }
  return diceResult;
}
//
function rollWhite(diceQty){
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
    success : 0,
    failure : 0,
    advantage : 0,
    threat : 0,
    triumph : 0,
    despair : 0,
    light : 0,
    dark : 0
  };


  for (var i=1;i<=diceQty;i++) {

    roll = randomInteger(12);


    switch(roll) {
    case 1:
      console.log(chalk.black.bgWhite("Light"));
      diceResult.light = diceResult.light + 1;
      break;
    case 2:
      console.log(chalk.black.bgWhite("Light"));
      diceResult.light = diceResult.light + 1;
      break;
    case 3:
      console.log(chalk.black.bgWhite("Light x2"));
      diceResult.light = diceResult.light + 2;
      break;
    case 4:
      console.log(chalk.black.bgWhite("Light x2"));
      diceResult.light = diceResult.light + 2;
      break;
    case 5:
      console.log(chalk.black.bgWhite("Light x2"));
      diceResult.light = diceResult.light + 2;
      break;
    case 6:
      console.log(chalk.black.bgWhite("Dark"));
      diceResult.dark = diceResult.dark + 1;
      break;
    case 7:
      console.log(chalk.black.bgWhite("Dark"));
      diceResult.dark = diceResult.dark + 1;
      break;
    case 8:
      console.log(chalk.black.bgWhite("Dark"));
      diceResult.dark = diceResult.dark + 1;
      break;
    case 9:
      console.log(chalk.black.bgWhite("Dark"));
      diceResult.dark = diceResult.dark + 1;
      break;
    case 10:
      console.log(chalk.black.bgWhite("Dark"));
      diceResult.dark = diceResult.dark + 1;
      break;
    case 11:
      console.log(chalk.black.bgWhite("Dark"));
      diceResult.dark = diceResult.dark + 1;
      break;
    case 12:
      console.log(chalk.black.bgWhite("Dark x2"));
      diceResult.dark = diceResult.dark + 2;
      break;
    }
  }
  return diceResult;
}
