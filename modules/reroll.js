var print = require("./printValues.js").print;
var roll = require("./roll.js");
var dice = require("./dice.js").dice;

function reroll(params, diceResult, message, config, desc) {
  var channel = message.channel.id;
  var previousRolls = diceResult[channel].rolls;
  var command = params[0];
  switch(command) {
    case "add":
      var diceOrder = roll.processType(params.slice(1), diceResult, config, message, channel);
      for (var i = 0; i < diceOrder.length; i++) {
        roll.rollDice(diceOrder[i], diceResult, message, channel);
      }
      roll.printDice(message, diceResult, desc, channel);
      break;

    case "same":
      var rebuilt = [];
      for (var i = 0; i < previousRolls.length; i++) {
        rebuilt.push("1"+previousRolls[i][0]);
      }
      console.log(rebuilt);
      roll.roll(rebuilt, diceResult, message, config, desc);
      break;

    case "remove":
      roll.initdiceResult(diceResult, channel);
      var target = roll.processType(params.slice(1), diceResult, config, message, channel)
      for (var i = 0; i < target.length; i++) {
        var positions = [];
        for (var j = 0; j < previousRolls.length; j++) {
          if (previousRolls[j][0] == target[i]) {
          positions.push(j);
          }
        }
        if (positions[0] == undefined) {
          message.reply("No \"" + target[i] + "\" dice to remove");
          break;
        }
        var randomDie = dice(positions.length)-1;
        previousRolls.splice(positions[randomDie],1)
      }
      for (var i = 0; i < previousRolls.length; i++) {
        roll.rollDice(previousRolls[i][0], diceResult, message, channel, previousRolls[i][1]);
      }
      roll.printDice(message, diceResult, desc, channel);
      break;
    case "select":
        for (var i = 1; i < params.length; i++) {
          roll.initdiceResult(diceResult, channel);
          var color = params[i].replace(/\d/g, "")
          var location = params[i].replace(/\D/g, "")
          var positions = [];
          for (var j = 0; j < previousRolls.length; j++) {
            if (previousRolls[j][0] == color) {
            positions.push(j);
            }
          }
          if (positions[0] == undefined) {
            message.reply("No \"" + color + "\" dice to remove");
            break;
          }
          previousRolls[positions[location-1]] = "";
          roll.rollDice(color, diceResult, message, channel);
          var newRoll = diceResult[channel].rolls[0]
          previousRolls.splice(positions[location-1], 1, newRoll)
        }
        roll.initdiceResult(diceResult, channel);
        for (var k = 0; k < previousRolls.length; k++) {
          roll.rollDice(previousRolls[k][0], diceResult, message, channel, previousRolls[k][1]);
        }
        roll.printDice(message, diceResult, desc, channel);
      break
    default:
      break
  }

}

module.exports = {
  reroll: reroll,
};
