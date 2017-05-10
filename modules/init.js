var roll = require("./roll.js").roll;
const jsonfile = require('jsonfile');
var r = 0;

function init(params, initiativeOrder, message, diceResult, config) {
  var channel = message.channel.id;
  if (initiativeOrder[channel] == undefined) {
    initiativeOrder[channel] = {
      order: [],
      face: "",
      total: 0,
      turn: 1,
      round: 1,
      rolls: [],
      newslot: [],
    };
  }

  var command = params[0];
  switch(command) {
    //roll for initiativeOrder
    case "roll":
    case "r":
      console.log("Rolling initiativeOrder for " + message.author.username);
      if (diceResult[channel] == undefined) {
        diceResult[channel] = {};
      }
      if (params[1] == undefined || params[1] == "npc" || params[1] == "pc") {
        message.channel.sendMessage("No dice defined.  ie '!init roll yygg npc/pc'");
        return;
      }
      if (params[2] == undefined) {
        message.channel.sendMessage("No Character type defined.  ie '!init roll yygg npc/pc'");
        return;
      }
      diceResult[channel] = roll([params[1]], diceResult[channel], message, config, "Initiative roll");
      var rollResult = [diceResult[channel].success.toString() + diceResult[channel].advantage.toString() + diceResult[channel].triumph.toString(), params[2]]
      //console.log(rollResult[0] + " " + initiativeOrder[channel].rolls[initiativeOrder[channel].turn - 1][0]);
      if (initiativeOrder[channel].turn != 1) {
        initiativeOrder[channel].newslot.push(rollResult);
        if (params[2] == "npc") {
        message.channel.sendMessage(":smiling_imp: will be added to the initiative order in the next round");
        }
        if (params[2] == "pc") {
        message.channel.sendMessage(":slight_smile: will be added to the initiative order in the next round");
        }
      } else {
        initiativeOrder[channel].rolls.push(rollResult);
        addtoinitiativeOrder();
        printinitiativeOrder();
      }
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
        rolls: [],
        newslot: [],
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
        rolls: [],
        newslot: [],
      };
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
        console.log(initiativeOrder[channel].newslot.length);
        if (initiativeOrder[channel].newslot.length > 0) {
          initiativeOrder[channel].rolls = initiativeOrder[channel].rolls.concat(initiativeOrder[channel].newslot);
          addtoinitiativeOrder();
          initiativeOrder[channel].newslot = [];
        }
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

  //Adds a roll to the order and sorts it
  function addtoinitiativeOrder() {
    initiativeOrder[channel].rolls.sort().reverse();
    initiativeOrder[channel].order = [];
    for(var i = 0; i < initiativeOrder[channel].rolls.length; i++) {
      var mob = initiativeOrder[channel].rolls[i][1];
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
  }

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
    jsonfile.writeFile("data/initiativeOrder.json", initiativeOrder);
    message.channel.sendMessage("Round: " + initiativeOrder[channel].round + " Turn: " + initiativeOrder[channel].turn + "\nInitiative Order: ");
    if (initiativeOrder[channel].face == "") {
      return;
    }
    message.channel.sendMessage(initiativeOrder[channel].face);
  }
}

module.exports = {
    init: init,
};
