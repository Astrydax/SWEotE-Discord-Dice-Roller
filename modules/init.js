var roll = require("./roll.js").roll;
const jsonfile = require('jsonfile');
const config = require("../config.json");
var r = 0;

function init(params, initiativeOrder, message, diceResult, config, desc, bot, channelEmoji) {
  var channel = message.channel.id;
  if (initiativeOrder[channel] == undefined) {
    initiativeOrder[channel] = {
      turn: 1,
      round: 1,
      slots: [],
      newslots: [],
    };
  }

  var command = params.shift();
  switch(command) {
    //roll for initiativeOrder
    case "roll":
    case "r":
      console.log("Rolling initiativeOrder for " + message.author.username);
      if (diceResult[channel] == undefined) {
        diceResult[channel] = {};
      }
      if (params[0] == undefined || params[0] == "npc" || params[0] == "pc") {
        message.channel.send("No dice defined.  ie '!init roll yygg npc/pc'");
        return;
      }
      if (!(params[params.length - 1] == "npc" || params[params.length - 1] == "pc")) {
        message.channel.send("No Character type defined.  ie '!init roll yygg npc/pc'");
        return;
      }
      let type = params.pop();
      diceResult[channel] = roll(params, diceResult[channel], message, config, "Initiative roll", bot, channelEmoji);
      var rollResult = {success: diceResult[channel].success, advantage: diceResult[channel].advantage, triumph: diceResult[channel].triumph, type: type};
      if (initiativeOrder[channel].turn != 1) {
        initiativeOrder[channel].newslots.push(rollResult);
        if (type == "npc") {
        message.channel.send(":smiling_imp: will be added to the initiative order in the next round");
        }
        if (type == "pc") {
        message.channel.send(":slight_smile: will be added to the initiative order in the next round");
        }
      } else {
        initiativeOrder[channel].slots.push(rollResult);
        addtoinitiativeOrder();
        printinitiativeOrder();
      }
      break;
    //manually set initiativeOrder
    case "set":
    case "s":
      initiativeOrder[channel] = {
        turn: 1,
        round: 1,
        slots: [],
        newslots: [],
      };
      console.log("Setting current initiativeOrder for " + message.author.username);
      if (params[0] == undefined) {
        message.channel.send("No Initiative Order defined.  ie '!init set nppnn'");
        return;
      }
      for(var i = 0; i < params[0].length; i++) {
        var mob = params[0][i];
        switch(mob) {
          case "n":
            initiativeOrder[channel].slots.push({type: "npc"});
            break;
          case "p":
            initiativeOrder[channel].slots.push({type: "pc"});
            break;
          default:
            break;
        }
      }
      printinitiativeOrder();
      break;

    //Reset the initiativeOrder
    case "reset":
      console.log(message.author.username + " resets the Initiative Order");
      initiativeOrder[channel] = {
        turn: 1,
        round: 1,
        slots: [],
        newslots: [],
      };
      message.reply(" resets the Initiative Order");
      printinitiativeOrder();
      break;
    //advance to next Initiative slot
    case "next":
    case "n":
      if (initiativeOrder[channel].turn + 1 > initiativeOrder[channel].slots.length) {
        initiativeOrder[channel].turn = 1;
        initiativeOrder[channel].round++;
        message.channel.send("New Round!");
        if (initiativeOrder[channel].newslots.length > 0) {
          initiativeOrder[channel].slots = initiativeOrder[channel].slots.concat(initiativeOrder[channel].newslots);
          addtoinitiativeOrder();
          initiativeOrder[channel].newslots = [];
        }
      } else {
        initiativeOrder[channel].turn++;
      }
      printinitiativeOrder();
      break;
    //previous Initiative slot
    case "previous":
    case "p":
      if (initiativeOrder[channel].turn == 1 && initiativeOrder[channel].round == 1) {
        message.channel.send("Initiative is already at the starting turn!");
      } else if (initiativeOrder[channel].turn - 1 < 1) {
        initiativeOrder[channel].turn = initiativeOrder[channel].slots.length;
        initiativeOrder[channel].round--;
        message.channel.send("Previous Round!");
      } else {
        initiativeOrder[channel].turn--;
      }
      printinitiativeOrder();
      break;
    //manually modify the initiativeOrder
    case "modify":
      console.log(initiativeOrder[channel])
      console.log("Modifiying current initiativeOrder for " + message.author.username);
      //check if numbers are used
      if (params[0] == undefined) {
        message.channel.send("No Initiative Order defined.  ie '!init set nppnn'");
        return;
      }
      initiativeOrder[channel].slots = [];
      for(var i = 0; i < params[0].length; i++) {
        var mob = params[0][i];
        switch(mob) {
          case "n":
            initiativeOrder[channel].slots.push({type: "npc"});
            break;
          case "p":
            initiativeOrder[channel].slots.push({type: "pc"});
            break;
          default:
            break;
        }
      }
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

    initiativeOrder[channel].slots.sort(function(a, b) {
      var nameA = a.type
      var nameB = b.type
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    let order = ["triumph", "advantage", "success"];
    order.forEach((symbol)=>{
      initiativeOrder[channel].slots.sort(function (a, b) {
        return a[symbol] - b[symbol];
      });
    })
    initiativeOrder[channel].slots.reverse();
  }

  //Prints out Initiative Order to channel
  function printinitiativeOrder() {
    let faces = "";
    for (var i = initiativeOrder[channel].turn - 1; i < initiativeOrder[channel].slots.length; i++) {
      if (initiativeOrder[channel].slots[i].type == "npc") {
        faces += ":smiling_imp: ";
      } else if (initiativeOrder[channel].slots[i].type == "pc") {
        faces += ":slight_smile: ";
      }
    }
    faces += ":repeat: ";
    for (var i = 0; i < initiativeOrder[channel].turn - 1; i++) {
      if (initiativeOrder[channel].slots[i].type == "npc") {
        faces += ":smiling_imp: ";
      } else if (initiativeOrder[channel].slots[i].type == "pc") {
        faces += ":slight_smile: ";
      }
    }
    jsonfile.writeFile(`.${config.dataPath}/data/initiativeOrder.json`, initiativeOrder);
    message.channel.send("Round: " + initiativeOrder[channel].round + " Turn: " + initiativeOrder[channel].turn + "\nInitiative Order: ");
    if (faces == "") return;
    message.channel.send(faces);
  }
}

module.exports = {
    init: init,
};
