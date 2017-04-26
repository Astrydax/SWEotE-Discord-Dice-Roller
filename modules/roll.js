var chalk = require("chalk");
var print = require("./printValues.js");

exports.roll = function roll(params, diceResult, message, config, desc) {
    /*Sorting the dice types by suffix
    7 unique dice in total
    y/pro = Yellow
    g/a = Green
    b/boo = Blue
    blk/sb/k/s = Black
    r/c = red
    p/diff = Purple
    w/f = destiny/white
    */
    var channel = message.channel.id;

    //init diceResult[channel]
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
    };

    //Iterate over the parameters and call the dice roll functions respective to color
    //this allows users to list dice colors in any order
    if (params.length > 0) {
      if ((params[0]).match(/\d+/g) != null) {
        for (var i = 0; i < params.length; i++) {
          var diceQty = (params[i]).replace(/\D/g, "");
          if (diceQty > config.maxRollsPerDie) {
            message.reply("Roll exceeds max roll per die limit of " + config.maxRollsPerDie + " . Please try again.");
            return;
          }
          rollDice(params[i], diceQty, message);
        }
      } else {
        params = params.join('');
        for(var i = 0; i < params.length; i++) {
          var diceQty = 1;
          rollDice(params[i], diceQty, message);
        }
      }
    } else {
      message.reply("No dice rolled.");
      return;
    }

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
    response += "  " + print.results("suc", message) + cancelledDiceResult[channel].success;
  } else if (diceResult[channel].success < diceResult[channel].failure) {
    cancelledDiceResult[channel].failure = diceResult[channel].failure - diceResult[channel].success;
    response += "  " + print.results("fail", message) + cancelledDiceResult[channel].failure ;
  }
  //cancel Advantage/Threat
  if (diceResult[channel].advantage > diceResult[channel].threat) {
    cancelledDiceResult[channel].advantage = diceResult[channel].advantage - diceResult[channel].threat;
    response += "  " + print.results("adv", message) + cancelledDiceResult[channel].advantage;
  } else if (diceResult[channel].advantage < diceResult[channel].threat) {
    cancelledDiceResult[channel].threat = diceResult[channel].threat - diceResult[channel].advantage;
    response += "  " + print.results("thr", message) + cancelledDiceResult[channel].threat;
  }
  //Check for any Triumphs
  if (diceResult[channel].triumph != 0) {
    cancelledDiceResult[channel].triumph = diceResult[channel].triumph;
    response += "  " + print.results("tri", message) + diceResult[channel].triumph;
  }
  //Check for any Despair
  if (diceResult[channel].despair != 0) {
    cancelledDiceResult[channel].despair = diceResult[channel].despair;
    response += "  " + print.results("des", message) + diceResult[channel].despair;
  }
  //check for force
  if (diceResult[channel].light != 0) {
    response += "  " + print.results("ls", message) + diceResult[channel].light;
  }
  if (diceResult[channel].dark != 0) {
    response += "  " + print.results("ds", message) + diceResult[channel].dark;
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
  return diceResult[channel];

//uses the current params to roll dice and adds result to diceResult[channel]
function rollDice(color, diceQty, message) {
    color = color.replace(/\d/g, "");
    switch(color) {
      case "y":
      case "pro":
        console.log("Rolling " + diceQty + " Proficiency Dice.");
        rollYellow(diceQty, message);
        break;
      case "g":
      case "a":
        console.log("Rolling " + diceQty + " Ability Dice.");
        rollGreen(diceQty, message);
        break;
      case "b":
      case "boo":
        console.log("Rolling " + diceQty + " Boost Dice.");
        rollBlue(diceQty, message);
        break;
      case "blk":
      case "sb":
      case "s":
      case "k":
        console.log("Rolling " + diceQty + " Setback Dice.");
        rollBlack(diceQty, message);
        break;
      case "r":
      case "c":
        console.log("Rolling " + diceQty + " Challenge Dice.");
        rollRed(diceQty, message);
        break;
      case "p":
      case "diff":
      case "d":
        console.log("Rolling " + diceQty + " Difficulty Dice.");
        rollPurple(diceQty, message);
        break;
      case "w":
      case "f":
        console.log("Rolling " + diceQty + " Force Dice.");
        rollWhite(diceQty, message);
        break;
    }
}
function rollBlue(diceQty, message) {
  //Blue "Boost" die (d6)
  //1 Blank
  //2 Blank
  //3 Success
  //4 Advantage
  //5 Advantage + Advantage
  //6 Success + Advantage
  var roll = 0;
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 6) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.white.bgBlue("Blank"));
        diceResult[channel].face += print.results("bb", message);
        break;
      case 2:
        console.log(chalk.white.bgBlue("Blank"));
        diceResult[channel].face += print.results("bb", message);
        break;
      case 3:
        console.log(chalk.white.bgBlue("Success"));
        diceResult[channel].success += 1;
        diceResult[channel].face += print.results("bs", message);
        break;
      case 4:
        console.log(chalk.white.bgBlue("Advantage"));
        diceResult[channel].advantage += 1;
        diceResult[channel].face += print.results("ba", message);
        break;
      case 5:
        console.log(chalk.white.bgBlue("Advantage x2"));
        diceResult[channel].advantage += 2;
        diceResult[channel].face += print.results("baa", message);
        break;
      case 6:
        console.log(chalk.white.bgBlue("Success + Advantage"));
        diceResult[channel].success += 1;
        diceResult[channel].advantage += 1;
        diceResult[channel].face += print.results("bsa", message);
        break;
    }
  }
}
function rollGreen(diceQty, message) {
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
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 8) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.white.bgGreen("Blank"));
        diceResult[channel].face += print.results("gb", message);
        break;
      case 2:
        console.log(chalk.white.bgGreen("Success"));
        diceResult[channel].face += print.results("gs", message);
        diceResult[channel].success += 1;
        break;
      case 3:
        console.log(chalk.white.bgGreen("Success"));
        diceResult[channel].face += print.results("gs", message);
        diceResult[channel].success += 1;
        break;
      case 4:
        console.log(chalk.white.bgGreen("Advantage"));
        diceResult[channel].face += print.results("ga", message);
        diceResult[channel].advantage += 1;
        break;
      case 5:
        console.log(chalk.white.bgGreen("Advantage"));
        diceResult[channel].face += print.results("ga", message);
        diceResult[channel].advantage += 1;
        break;
      case 6:
        console.log(chalk.white.bgGreen("Success + Advantage"));
        diceResult[channel].face += print.results("gsa", message);
        diceResult[channel].success += 1;
        diceResult[channel].advantage += 1;
        break;
      case 7:
        console.log(chalk.white.bgGreen("Advantage x2"));
        diceResult[channel].face += print.results("gaa", message);
        diceResult[channel].advantage += 2;
        break;
      case 8:
        console.log(chalk.white.bgGreen("Success x2"));
        diceResult[channel].face += print.results("gss", message);
        diceResult[channel].success += 2;
        break;
    }
  }
}
function rollYellow(diceQty, message) {
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
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 12) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.black.bgYellow("blank"));
        diceResult[channel].face += print.results("yb", message);
        break;
      case 2:
        console.log(chalk.black.bgYellow("Success"));
        diceResult[channel].success += 1;
        diceResult[channel].face += print.results("ys", message);
        break;
      case 3:
        console.log(chalk.black.bgYellow("Success"));
        diceResult[channel].success += 1;
        diceResult[channel].face += print.results("ys", message);
        break;
      case 4:
        console.log(chalk.black.bgYellow("Success x2"));
        diceResult[channel].success += 2;
        diceResult[channel].face += print.results("yss", message);
        break;
      case 5:
        console.log(chalk.black.bgYellow("Success x2"));
        diceResult[channel].success += 2;
        diceResult[channel].face += print.results("yss", message);
        break;
      case 6:
        console.log(chalk.black.bgYellow("Advantage"));
        diceResult[channel].advantage += 1;
        diceResult[channel].face += print.results("ya", message);
        break;
      case 7:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult[channel].success += 1;
        diceResult[channel].advantage += 1;
        diceResult[channel].face += print.results("ysa", message);
        break;
      case 8:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult[channel].success += 1;
        diceResult[channel].advantage += 1;
        diceResult[channel].face += print.results("ysa", message);
        break;
      case 9:
        console.log(chalk.black.bgYellow("Success + Advantage"));
        diceResult[channel].success += 1;
        diceResult[channel].advantage += 1;
        diceResult[channel].face += print.results("ysa", message);
        break;
      case 10:
        console.log(chalk.black.bgYellow("Advantage x2"));
        diceResult[channel].advantage += 2;
        diceResult[channel].face += print.results("yaa", message);
        break;
      case 11:
        console.log(chalk.black.bgYellow("Advantage x2"));
        diceResult[channel].advantage += 2;
        diceResult[channel].face += print.results("yaa", message);
        break;
      case 12:
        console.log(chalk.black.bgYellow("Triumph"));
        diceResult[channel].triumph += 1;
        diceResult[channel].success += 1;
        diceResult[channel].face += print.results("yt", message);
        break;
    }
  }
}

function rollBlack(diceQty, message) {
  //Black "Setback" die (d6)
  //1 Blank
  //2 Blank
  //3 Failure
  //4 Failure
  //5 Threat
  //6 Threat
  var roll = 0;
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 6) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.white.bgBlack("Blank"));
        diceResult[channel].face += print.results("blkb", message);
        break;
      case 2:
        console.log(chalk.white.bgBlack("Blank"));
        diceResult[channel].face += print.results("blkb", message);
        break;
      case 3:
        console.log(chalk.white.bgBlack("Failure"));
        diceResult[channel].failure += 1;
        diceResult[channel].face += print.results("blkf", message);
        break;
      case 4:
        console.log(chalk.white.bgBlack("Failure"));
        diceResult[channel].failure += 1;
        diceResult[channel].face += print.results("blkf", message);
        break;
      case 5:
        console.log(chalk.white.bgBlack("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("blkt", message);
        break;
      case 6:
        console.log(chalk.white.bgBlack("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("blkt", message);
        break;
    }
  }
}

function rollPurple(diceQty, message) {
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
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 8) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.white.bgMagenta("Blank"));
        diceResult[channel].face += print.results("pb", message);
        break;
      case 2:
        console.log(chalk.white.bgMagenta("Failure"));
        diceResult[channel].failure += 1;
        diceResult[channel].face += print.results("pf", message);
        break;
      case 3:
        console.log(chalk.white.bgMagenta("Failure x2"));
        diceResult[channel].failure += 2;
        diceResult[channel].face += print.results("pff", message);
        break;
      case 4:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("pt", message);
        break;
      case 5:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("pt", message);
        break;
      case 6:
        console.log(chalk.white.bgMagenta("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("pt", message);
        break;
      case 7:
        console.log(chalk.white.bgMagenta("Threat x2"));
        diceResult[channel].threat += 2;
        diceResult[channel].face += print.results("ptt", message);
        break;
      case 8:
        console.log(chalk.white.bgMagenta("Failure + Threat"));
        diceResult[channel].failure += 1;
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("pft", message);
        break;
    }
  }
}

function rollRed(diceQty, message) {
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
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 12) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.black.bgRed("Blank"));
        diceResult[channel].face += print.results("rb", message);
        break;
      case 2:
        console.log(chalk.black.bgRed("Despair"));
        diceResult[channel].despair += 1;
        diceResult[channel].failure += 1;
        diceResult[channel].face += print.results("rd", message);
        break;
      case 3:
        console.log(chalk.black.bgRed("Failure"));
        diceResult[channel].failure += 1;
        diceResult[channel].face += print.results("rf", message);
        break;
      case 4:
        console.log(chalk.black.bgRed("Failure"));
        diceResult[channel].failure += 1;
        diceResult[channel].face += print.results("rf", message);
        break;
      case 5:
        console.log(chalk.black.bgRed("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("rt", message);
        break;
      case 6:
        console.log(chalk.black.bgRed("Threat"));
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("rt", message);
        break;
      case 7:
        console.log(chalk.black.bgRed("Failure x2"));
        diceResult[channel].failure += 2;
        diceResult[channel].face += print.results("rff", message);
        break;
      case 8:
        console.log(chalk.black.bgRed("Failure x2"));
        diceResult[channel].failure += 2;
        diceResult[channel].face += print.results("rff", message);
        break;
      case 9:
        console.log(chalk.black.bgRed("Threat x2"));
        diceResult[channel].threat += 2;
        diceResult[channel].face += print.results("rtt", message);
        break;
      case 10:
        console.log(chalk.black.bgRed("Threat x2"));
        diceResult[channel].threat += 2;
        diceResult[channel].face += print.results("rtt", message);
        break;
      case 11:
        console.log(chalk.black.bgRed("Failure + Threat"));
        diceResult[channel].failure += 1;
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("rft", message);
        break;
      case 12:
        console.log(chalk.black.bgRed("Failure + Threat"));
        diceResult[channel].failure += 1;
        diceResult[channel].threat += 1;
        diceResult[channel].face += print.results("rft", message);
        break;
    }
  }
}

function rollWhite(diceQty, message) {
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
  for (var i = 1; i <= diceQty; i++) {
    roll = Math.floor(Math.random() * 12) + 1;
    switch (roll) {
      case 1:
        console.log(chalk.black.bgWhite("Light"));
        diceResult[channel].light += 1;
        diceResult[channel].face += print.results("wl", message);
        break;
      case 2:
        console.log(chalk.black.bgWhite("Light"));
        diceResult[channel].light += 1;
        diceResult[channel].face += print.results("wl", message);
        break;
      case 3:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult[channel].light += 2;
        diceResult[channel].face += print.results("wll", message);
        break;
      case 4:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult[channel].light += 2;
        diceResult[channel].face += print.results("wll", message);
        break;
      case 5:
        console.log(chalk.black.bgWhite("Light x2"));
        diceResult[channel].light += 2;
        diceResult[channel].face += print.results("wll", message);
        break;
      case 6:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult[channel].dark += 1;
        diceResult[channel].face += print.results("wd", message);
        break;
      case 7:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult[channel].dark += 1;
        diceResult[channel].face += print.results("wd", message);
        break;
      case 8:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult[channel].dark += 1;
        diceResult[channel].face += print.results("wd", message);
        break;
      case 9:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult[channel].dark += 1;
        diceResult[channel].face += print.results("wd", message);
        break;
      case 10:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult[channel].dark += 1;
        diceResult[channel].face += print.results("wd", message);
        break;
      case 11:
        console.log(chalk.black.bgWhite("Dark"));
        diceResult[channel].dark += 1;
        diceResult[channel].face += print.results("wd", message);
        break;
      case 12:
        console.log(chalk.black.bgWhite("Dark x2"));
        diceResult[channel].dark += 2;
        diceResult[channel].face += print.results("wdd", message);
        break;
      }
    }
  }
}
