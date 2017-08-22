var chalk = require("chalk");
var print = require("./printValues.js").print;
var dice = require("./dice.js").dice;
const jsonfile = require('jsonfile');

function roll(params, diceResult, message, config, desc) {
  var channel = message.channel.id;
  if (params[0] == undefined) {
    message.reply("No dice rolled.");
    return;
  }
  initdiceResult(diceResult, channel)
  var diceOrder = processType(params, diceResult, config, message, channel);
  if (diceOrder == 0) return;
  for (var i = 0; i < diceOrder.length; i++) {
    rollDice(diceOrder[i], diceResult, message, channel);
  }
  printDice(message, diceResult, desc, channel);

  return diceResult[channel];
}

//init diceResult[channel]
function initdiceResult(diceResult, channel) {
  diceResult[channel] = {
    success: 0,
    failure: 0,
    advantage: 0,
    threat: 0,
    triumph: 0,
    despair: 0,
    light: 0,
    dark: 0,
    face: "",
    rolls: [],
  };
  return diceResult[channel];
}

//Iterate over the parameters and call the dice roll functions respective to color
function processType(params, diceResult, config, message, channel) {
    if (params.length > 0) {
      var diceOrder = [];
      if ((params[0]).match(/\d+/g) != null) {
        for (var i = 0; i < params.length; i++) {
          var diceQty = (params[i]).replace(/\D/g, "");
          var color = params[i].replace(/\d/g, "");
          if (diceQty > config.maxRollsPerDie) {
            message.reply("Roll exceeds max roll per die limit of " + config.maxRollsPerDie + " . Please try again.");
            return 0;
          }
          for (var j = 0; j < diceQty; j++) {
            diceOrder.push(color);
          }
        }
      } else {
          params = params.join('');
          for(var i = 0; i < params.length; i++) {
            diceOrder.push(params[i]);
          }
        }
    } else {
    message.reply("No dice rolled.");
    return 0;
  }
  return diceOrder;
}

//roll dice and adds result to diceResult[channel]
function rollDice(color, diceResult, message, channel, number) {
    switch(color) {
      case "y":
      case "pro":
      case "proficiency":
        if (number == undefined) {
          number = dice(12);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("yellow", number, diceResult, message, channel);
        break;
      case "g":
      case "a":
      case "ability":
        if (number == undefined) {
          number = dice(8);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("green", number, diceResult, message, channel);
        break;
      case "b":
      case "boo":
      case "boost":
        if (number == undefined) {
          number = dice(6);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("blue", number, diceResult, message, channel);
        break;
      case "blk":
      case "sb":
      case "s":
      case "k":
      case "setback":
        if (number == undefined) {
          number = dice(6);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("black", number, diceResult, message, channel);
        break;
      case "r":
      case "c":
      case "challenge":
        if (number == undefined) {
          number = dice(12);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("red", number, diceResult, message, channel);
        break;
      case "p":
      case "diff":
      case "d":
      case "difficulty":
        if (number == undefined) {
          number = dice(8);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("purple", number, diceResult, message, channel);
        break;
      case "w":
      case "f":
      case "force":
        if (number == undefined) {
          number = dice(12);
        }
        diceResult[channel].rolls.push([color, number]);
        convertDice("white", number, diceResult, message, channel);
        break;
      case "success":
      case "*":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("suc", message);
        diceResult[channel].success += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "advantage":
      case "adv":
      case "v":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("adv", message);
        diceResult[channel].advantage += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "triumph":
      case "tri":
      case "!":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("tri", message);
        diceResult[channel].triumph += 1;
        diceResult[channel].success += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "failure":
      case "fail":
      case "-":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("fail", message);
        diceResult[channel].failure += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "threat":
      case "thr":
      case "t":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("thr", message);
        diceResult[channel].threat += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "despair":
      case "des":
      case "$":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("des", message);
        diceResult[channel].despair += 1;
        diceResult[channel].failure += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "light":
      case "l":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("ls", message);
        diceResult[channel].light += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      case "dark":
      case "n":
        console.log(`Adding ${color} to the roll results`);
        diceResult[channel].face += print("ds", message);
        diceResult[channel].dark += 1;
        diceResult[channel].rolls.push([color, 0]);
        break;
      default:
        break;
    }
}

function printDice (message, diceResult, desc, channel) {
  //BEGIN PREPARING THE MESSAGE TO SEND
  var cancelledDiceResult = {
    [channel]: {
      success: 0,
      failure: 0,
      advantage: 0,
      threat: 0,
      triumph: 0,
      despair: 0,
      light: 0,
      dark: 0
      }
    };

  //Do the cancellations
  var response = "";

  //cancel success/failures
  if (diceResult[channel].success > diceResult[channel].failure) {
    cancelledDiceResult[channel].success =  diceResult[channel].success - diceResult[channel].failure;
    response += "  " + print("suc", message) + cancelledDiceResult[channel].success;
  } else if (diceResult[channel].success < diceResult[channel].failure) {
    cancelledDiceResult[channel].failure = diceResult[channel].failure - diceResult[channel].success;
    response += "  " + print("fail", message) + cancelledDiceResult[channel].failure ;
  }
  //cancel Advantage/Threat
  if (diceResult[channel].advantage > diceResult[channel].threat) {
    cancelledDiceResult[channel].advantage = diceResult[channel].advantage - diceResult[channel].threat;
    response += "  " + print("adv", message) + cancelledDiceResult[channel].advantage;
  } else if (diceResult[channel].advantage < diceResult[channel].threat) {
    cancelledDiceResult[channel].threat = diceResult[channel].threat - diceResult[channel].advantage;
    response += "  " + print("thr", message) + cancelledDiceResult[channel].threat;
  }
  //Check for any Triumphs
  if (diceResult[channel].triumph != 0) {
    cancelledDiceResult[channel].triumph = diceResult[channel].triumph;
    response += "  " + print("tri", message) + diceResult[channel].triumph;
  }
  //Check for any Despair
  if (diceResult[channel].despair != 0) {
    cancelledDiceResult[channel].despair = diceResult[channel].despair;
    response += "  " + print("des", message) + diceResult[channel].despair;
  }
  //check for force
  if (diceResult[channel].light != 0) {
    response += "  " + print("ls", message) + diceResult[channel].light;
  }
  if (diceResult[channel].dark != 0) {
    response += "  " + print("ds", message) + diceResult[channel].dark;
  }
  //if all the dice cancel out, response filled with this
  if (response == "") {
    response += "All dice have cancelled out";
  }
  if (diceResult[channel].face.length > 1500) {
    diceResult[channel].face = "Too many dice to display.";
  }
  if (diceResult[channel].face != "") {
    message.channel.sendMessage(diceResult[channel].face);
    message.reply(desc + " results:" + "\n\n\t" + response);
  } else {
    message.reply("No dice rolled.");
  }
  jsonfile.writeFile("data/diceResult.json", diceResult);
}

function convertDice(color, number, diceResult, message, channel) {
  switch(color) {
      case "blue":
        //Blue "Boost" die (d6)
        //1 Blank
        //2 Blank
        //3 Success
        //4 Advantage
        //5 Advantage + Advantage
        //6 Success + Advantage
        console.log("Rolling a Boost Dice.");
        switch (number) {
          case 1:
            console.log(chalk.white.bgBlue("Blank"));
            diceResult[channel].face += print("bb", message);
            break;
          case 2:
            console.log(chalk.white.bgBlue("Blank"));
            diceResult[channel].face += print("bb", message);
            break;
          case 3:
            console.log(chalk.white.bgBlue("Success"));
            diceResult[channel].success += 1;
            diceResult[channel].face += print("bs", message);
            break;
          case 4:
            console.log(chalk.white.bgBlue("Advantage"));
            diceResult[channel].advantage += 1;
            diceResult[channel].face += print("ba", message);
            break;
          case 5:
            console.log(chalk.white.bgBlue("Advantage x2"));
            diceResult[channel].advantage += 2;
            diceResult[channel].face += print("baa", message);
            break;
          case 6:
            console.log(chalk.white.bgBlue("Success + Advantage"));
            diceResult[channel].success += 1;
            diceResult[channel].advantage += 1;
            diceResult[channel].face += print("bsa", message);
            break;
        }
        break;
      case "green":
        console.log("Rolling a Ability Dice.");
        //Green "Ability" die (d8)
        //1 Blank
        //2 Success
        //3 Success
        //4 Advantage
        //5 Advantage
        //6 Success + Advantage
        //7 Advantage + Advantage
        //8 Success + Success
        switch (number) {
          case 1:
            console.log(chalk.white.bgGreen("Blank"));
            diceResult[channel].face += print("gb", message);
            break;
          case 2:
            console.log(chalk.white.bgGreen("Success"));
            diceResult[channel].face += print("gs", message);
            diceResult[channel].success += 1;
            break;
          case 3:
            console.log(chalk.white.bgGreen("Success"));
            diceResult[channel].face += print("gs", message);
            diceResult[channel].success += 1;
            break;
          case 4:
            console.log(chalk.white.bgGreen("Advantage"));
            diceResult[channel].face += print("ga", message);
            diceResult[channel].advantage += 1;
            break;
          case 5:
            console.log(chalk.white.bgGreen("Advantage"));
            diceResult[channel].face += print("ga", message);
            diceResult[channel].advantage += 1;
            break;
          case 6:
            console.log(chalk.white.bgGreen("Success + Advantage"));
            diceResult[channel].face += print("gsa", message);
            diceResult[channel].success += 1;
            diceResult[channel].advantage += 1;
            break;
          case 7:
            console.log(chalk.white.bgGreen("Advantage x2"));
            diceResult[channel].face += print("gaa", message);
            diceResult[channel].advantage += 2;
            break;
          case 8:
            console.log(chalk.white.bgGreen("Success x2"));
            diceResult[channel].face += print("gss", message);
            diceResult[channel].success += 2;
            break;
        }
        break;
      case "yellow":
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
        console.log("Rolling a Proficiency Dice.");
        switch (number) {
          case 1:
            console.log(chalk.black.bgYellow("blank"));
            diceResult[channel].face += print("yb", message);
            break;
          case 2:
            console.log(chalk.black.bgYellow("Success"));
            diceResult[channel].success += 1;
            diceResult[channel].face += print("ys", message);
            break;
          case 3:
            console.log(chalk.black.bgYellow("Success"));
            diceResult[channel].success += 1;
            diceResult[channel].face += print("ys", message);
            break;
          case 4:
            console.log(chalk.black.bgYellow("Success x2"));
            diceResult[channel].success += 2;
            diceResult[channel].face += print("yss", message);
            break;
          case 5:
            console.log(chalk.black.bgYellow("Success x2"));
            diceResult[channel].success += 2;
            diceResult[channel].face += print("yss", message);
            break;
          case 6:
            console.log(chalk.black.bgYellow("Advantage"));
            diceResult[channel].advantage += 1;
            diceResult[channel].face += print("ya", message);
            break;
          case 7:
            console.log(chalk.black.bgYellow("Success + Advantage"));
            diceResult[channel].success += 1;
            diceResult[channel].advantage += 1;
            diceResult[channel].face += print("ysa", message);
            break;
          case 8:
            console.log(chalk.black.bgYellow("Success + Advantage"));
            diceResult[channel].success += 1;
            diceResult[channel].advantage += 1;
            diceResult[channel].face += print("ysa", message);
            break;
          case 9:
            console.log(chalk.black.bgYellow("Success + Advantage"));
            diceResult[channel].success += 1;
            diceResult[channel].advantage += 1;
            diceResult[channel].face += print("ysa", message);
            break;
          case 10:
            console.log(chalk.black.bgYellow("Advantage x2"));
            diceResult[channel].advantage += 2;
            diceResult[channel].face += print("yaa", message);
            break;
          case 11:
            console.log(chalk.black.bgYellow("Advantage x2"));
            diceResult[channel].advantage += 2;
            diceResult[channel].face += print("yaa", message);
            break;
          case 12:
            console.log(chalk.black.bgYellow("Triumph"));
            diceResult[channel].triumph += 1;
            diceResult[channel].success += 1;
            diceResult[channel].face += print("yt", message);
            break;
        }
        break;
      case "black":
        //Black "Setback" die (d6)
        //1 Blank
        //2 Blank
        //3 Failure
        //4 Failure
        //5 Threat
        //6 Threat
        console.log("Rolling a Setback Dice.");
        switch (number) {
          case 1:
            console.log(chalk.white.bgBlack("Blank"));
            diceResult[channel].face += print("blkb", message);
            break;
          case 2:
            console.log(chalk.white.bgBlack("Blank"));
            diceResult[channel].face += print("blkb", message);
            break;
          case 3:
            console.log(chalk.white.bgBlack("Failure"));
            diceResult[channel].failure += 1;
            diceResult[channel].face += print("blkf", message);
            break;
          case 4:
            console.log(chalk.white.bgBlack("Failure"));
            diceResult[channel].failure += 1;
            diceResult[channel].face += print("blkf", message);
            break;
          case 5:
            console.log(chalk.white.bgBlack("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("blkt", message);
            break;
          case 6:
            console.log(chalk.white.bgBlack("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("blkt", message);
            break;
        }
        break;
      case "purple":
        //Purple "Difficulty" die (d8)
        //1 Blank
        //2 Failure
        //3 Failure x2
        //4 Threat
        //5 Threat
        //6 Threat
        //7 Threat + Threat
        //8 Failure + Threat
        console.log("Rolling a Difficulty Dice.");
        switch (number) {
          case 1:
            console.log(chalk.white.bgMagenta("Blank"));
            diceResult[channel].face += print("pb", message);
            break;
          case 2:
            console.log(chalk.white.bgMagenta("Failure"));
            diceResult[channel].failure += 1;
            diceResult[channel].face += print("pf", message);
            break;
          case 3:
            console.log(chalk.white.bgMagenta("Failure x2"));
            diceResult[channel].failure += 2;
            diceResult[channel].face += print("pff", message);
            break;
          case 4:
            console.log(chalk.white.bgMagenta("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("pt", message);
            break;
          case 5:
            console.log(chalk.white.bgMagenta("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("pt", message);
            break;
          case 6:
            console.log(chalk.white.bgMagenta("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("pt", message);
            break;
          case 7:
            console.log(chalk.white.bgMagenta("Threat x2"));
            diceResult[channel].threat += 2;
            diceResult[channel].face += print("ptt", message);
            break;
          case 8:
            console.log(chalk.white.bgMagenta("Failure + Threat"));
            diceResult[channel].failure += 1;
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("pft", message);
            break;
        }
        break;
      case "red":
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
        console.log("Rolling a Challenge Dice.");
        switch (number) {
          case 1:
            console.log(chalk.black.bgRed("Blank"));
            diceResult[channel].face += print("rb", message);
            break;
          case 2:
            console.log(chalk.black.bgRed("Despair"));
            diceResult[channel].despair += 1;
            diceResult[channel].failure += 1;
            diceResult[channel].face += print("rd", message);
            break;
          case 3:
            console.log(chalk.black.bgRed("Failure"));
            diceResult[channel].failure += 1;
            diceResult[channel].face += print("rf", message);
            break;
          case 4:
            console.log(chalk.black.bgRed("Failure"));
            diceResult[channel].failure += 1;
            diceResult[channel].face += print("rf", message);
            break;
          case 5:
            console.log(chalk.black.bgRed("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("rt", message);
            break;
          case 6:
            console.log(chalk.black.bgRed("Threat"));
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("rt", message);
            break;
          case 7:
            console.log(chalk.black.bgRed("Failure x2"));
            diceResult[channel].failure += 2;
            diceResult[channel].face += print("rff", message);
            break;
          case 8:
            console.log(chalk.black.bgRed("Failure x2"));
            diceResult[channel].failure += 2;
            diceResult[channel].face += print("rff", message);
            break;
          case 9:
            console.log(chalk.black.bgRed("Threat x2"));
            diceResult[channel].threat += 2;
            diceResult[channel].face += print("rtt", message);
            break;
          case 10:
            console.log(chalk.black.bgRed("Threat x2"));
            diceResult[channel].threat += 2;
            diceResult[channel].face += print("rtt", message);
            break;
          case 11:
            console.log(chalk.black.bgRed("Failure + Threat"));
            diceResult[channel].failure += 1;
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("rft", message);
            break;
          case 12:
            console.log(chalk.black.bgRed("Failure + Threat"));
            diceResult[channel].failure += 1;
            diceResult[channel].threat += 1;
            diceResult[channel].face += print("rft", message);
            break;
        }
        break;
      case "white":
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
        console.log("Rolling a Force Dice.");
        switch (number) {
        case 1:
          console.log(chalk.black.bgWhite("Light"));
          diceResult[channel].light += 1;
          diceResult[channel].face += print("wl", message);
          break;
        case 2:
          console.log(chalk.black.bgWhite("Light"));
          diceResult[channel].light += 1;
          diceResult[channel].face += print("wl", message);
          break;
        case 3:
          console.log(chalk.black.bgWhite("Light x2"));
          diceResult[channel].light += 2;
          diceResult[channel].face += print("wll", message);
          break;
        case 4:
          console.log(chalk.black.bgWhite("Light x2"));
          diceResult[channel].light += 2;
          diceResult[channel].face += print("wll", message);
          break;
        case 5:
          console.log(chalk.black.bgWhite("Light x2"));
          diceResult[channel].light += 2;
          diceResult[channel].face += print("wll", message);
          break;
        case 6:
          console.log(chalk.black.bgWhite("Dark"));
          diceResult[channel].dark += 1;
          diceResult[channel].face += print("wd", message);
          break;
        case 7:
          console.log(chalk.black.bgWhite("Dark"));
          diceResult[channel].dark += 1;
          diceResult[channel].face += print("wd", message);
          break;
        case 8:
          console.log(chalk.black.bgWhite("Dark"));
          diceResult[channel].dark += 1;
          diceResult[channel].face += print("wd", message);
          break;
        case 9:
          console.log(chalk.black.bgWhite("Dark"));
          diceResult[channel].dark += 1;
          diceResult[channel].face += print("wd", message);
          break;
        case 10:
          console.log(chalk.black.bgWhite("Dark"));
          diceResult[channel].dark += 1;
          diceResult[channel].face += print("wd", message);
          break;
        case 11:
          console.log(chalk.black.bgWhite("Dark"));
          diceResult[channel].dark += 1;
          diceResult[channel].face += print("wd", message);
          break;
        case 12:
          console.log(chalk.black.bgWhite("Dark x2"));
          diceResult[channel].dark += 2;
          diceResult[channel].face += print("wdd", message);
          break;
        }
        break;
      }
    }

module.exports = {
    roll: roll,
    initdiceResult: initdiceResult,
    processType: processType,
    rollDice: rollDice,
    printDice: printDice,
    convertDice: convertDice
};
