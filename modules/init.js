var roll = require("./roll.js");
var initiativeRolls = {};
var r = 0;

exports.init = function init(params, initiativeOrder, message, diceResult, print, config, desc) {
  var channel = message.channel.id;
  if (initiativeOrder[channel] == undefined) {
    initiativeOrder[channel] = {
      order: [],
      face: "",
      total: 0,
      turn: 1,
      round: 1,
    };
  }

  var command = params[0];
  switch(command) {
    //roll for initiativeOrder
    case "roll":
      console.log("Rolling initiativeOrder for " + message.author.username);
      if (diceResult[channel] == undefined) {
        diceResult[channel] = {};
      }
      if (initiativeRolls[channel] == undefined) {
        initiativeRolls[channel] = [];
      }
      if (params[1] == undefined) {
        message.channel.sendMessage("No dice defined.  ie '!init roll yygg npc/pc'");
        return;
      }
      if (params[2] == undefined) {
        message.channel.sendMessage("No Character type defined.  ie '!init roll yygg npc/pc'");
        return;
      }
      if (initiativeOrder[channel].turn != 1) {
        message.channel.sendMessage("You can only add Init slots on turn 1 (Start of a new Round)");
        return;
      }
      var pass = params.slice(1);
      diceResult[channel] = roll.roll(pass, diceResult[channel], message, print, config, desc);
      initiativeRolls[channel].push([diceResult[channel].success.toString() + diceResult[channel].advantage.toString() + diceResult[channel].triumph.toString(), params[2]]);
      initiativeRolls[channel].sort();
      initiativeOrder[channel].order = [];
      for(var i = initiativeRolls[channel].length; i > 0; i--) {
        var mob = initiativeRolls[channel][i-1][1];
        switch(mob) {
          case "npc":
            initiativeOrder[channel].order.push("NPC");
            break;
          case "pc":
            initiativeOrder[channel].order.push("PC");
            break;
          default:
            break;
          }
        }
      initiativeOrder[channel].total = initiativeOrder[channel].order.length;
      printinitiativeOrder();
      break;
    //manually set initiativeOrder
    case "set":
    case "s":
      initiativeOrder[channel] = {
        order: [],
        face: "",
        total: 0,
        turn: 1,
        round: 1,
      };
      console.log("Setting current initiativeOrder for " + message.author.username);
      if (params[1] == undefined) {
        message.channel.sendMessage("No Initiative Order defined.  ie '!init set nppnn'");
        return;
      }
      for(var i = 0; i < params[1].length; i++) {
        var mob = params[1][i];
        switch(mob) {
          case "n":
            initiativeOrder[channel].order.push("NPC");
            break;
          case "p":
            initiativeOrder[channel].order.push("PC");
            break;
          default:
            break;
        }
      }
      initiativeOrder[channel].total = initiativeOrder[channel].order.length;
      printinitiativeOrder();
      break;

    //Reset the initiativeOrder
    case "reset":
      console.log(message.author.username + " resets the Initiative Order");
      initiativeOrder[channel] = {
        order: [],
        face: "",
        total: 0,
        turn: 1,
        round: 1,
      };
      initiativeRolls[channel] = [];
      message.reply(" resets the Initiative Order");
      printinitiativeOrder();
      break;
    //advance to next Initiative slot
    case "next":
    case "n":
      if (initiativeOrder[channel].turn + 1 > initiativeOrder[channel].total) {
        initiativeOrder[channel].turn = 1;
        initiativeOrder[channel].round++;
        message.channel.sendMessage("New Round!");
      } else {
        initiativeOrder[channel].turn++;
      }
      printinitiativeOrder();
      break;
    //previous Initiative slot
    case "previous":
    case "p":
      if (initiativeOrder[channel].turn - 1 < 1) {
        initiativeOrder[channel].turn = initiativeOrder[channel].total;
        initiativeOrder[channel].round--;
        message.channel.sendMessage("Previous Round!");
      } else {
        initiativeOrder[channel].turn--;
      }
      printinitiativeOrder();
      break;
    //manually modify the initiativeOrder
    case "modify":
      console.log("Modifiying current initiativeOrder for " + message.author.username);
      //check if numbers are used
      if (params[1] == undefined) {
        message.channel.sendMessage("No Initiative Order defined.  ie '!init set nppnn'");
        return;
      }
      initiativeOrder[channel].order = [];
      for(var i = 0; i < params[1].length; i++) {
        var mob = params[1][i];
        switch(mob) {
          case "n":
            initiativeOrder[channel].order.push("NPC");
            break;
          case "p":
            initiativeOrder[channel].order.push("PC");
            break;
          default:
            break;
        }
      }
      initiativeOrder[channel].total = initiativeOrder[channel].order.length;
      printinitiativeOrder();
      break;

    default:
      console.log("Just printing initiativeOrder");
      printinitiativeOrder();
      break;
  }
  return initiativeOrder;

  //Prints out Initiative Order to channel
  function printinitiativeOrder() {
    initiativeOrder[channel].face = "";
    for (var i = initiativeOrder[channel].turn - 1; i < initiativeOrder[channel].order.length; i++) {
      if (initiativeOrder[channel].order[i] == "NPC") {
        initiativeOrder[channel].face += ":smiling_imp: ";
      } else if (initiativeOrder[channel].order[i] == "PC") {
        initiativeOrder[channel].face += ":slight_smile: ";
      }
    }
    initiativeOrder[channel].face += ":repeat: ";
    for (var i = 0; i < initiativeOrder[channel].turn - 1; i++) {
      if (initiativeOrder[channel].order[i] == "NPC") {
        initiativeOrder[channel].face += ":smiling_imp: ";
      } else if (initiativeOrder[channel].order[i] == "PC") {
        initiativeOrder[channel].face += ":slight_smile: ";
      }
    }
    message.channel.sendMessage("Round: " + initiativeOrder[channel].round + " Turn: " + initiativeOrder[channel].turn + "\nInitiative Order: ");
    if (initiativeOrder[channel].face == "") {
      return;
    }
    message.channel.sendMessage(initiativeOrder[channel].face);
  }
}
