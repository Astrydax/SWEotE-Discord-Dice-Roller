var roll = require("./roll.js").roll;
const firebase = require('firebase');
const config = require("../config.js").config;
var r = 0;

function initiative(params, initiativeOrder, message, bot, channelEmoji) {
  if (initiativeOrder == undefined) initiativeOrder = initializeinitOrder();
  if (initiativeOrder.newslots == undefined) initiativeOrder.newslots = [];
  if (initiativeOrder.slots == undefined) initiativeOrder.slots = [];

  var command = params.shift();
  switch(command) {
    //roll for initiativeOrder
    case "roll":
    case "r":
      console.log("Rolling initiativeOrder for " + message.author.username);
      if (params[0] == undefined || params[0] == "npc" || params[0] == "pc") {
        message.channel.send("No dice defined.  ie '!init roll yygg npc/pc'");
        break;
      }
      if (!(params[params.length - 1] == "npc" || params[params.length - 1] == "pc")) {
        message.channel.send("No Character type defined.  ie '!init roll yygg npc/pc'");
        break;
      }
      let type = params.pop();
      let diceResult = roll(params, message, bot, "Initiative roll", channelEmoji).results;
      var rollResult = {success: diceResult.success, advantage: diceResult.advantage, triumph: diceResult.triumph, type: type};
      if (initiativeOrder.turn != 1) {
        initiativeOrder.newslots.push(rollResult);
        if (type == "npc") {
        message.channel.send(":smiling_imp: will be added to the initiative order in the next round");
        }
        if (type == "pc") {
        message.channel.send(":slight_smile: will be added to the initiative order in the next round");
        }
      } else {
        initiativeOrder.slots.push(rollResult);
        initiativeOrder = addtoinitiativeOrder(initiativeOrder);
      }
      break;
    //manually set initiativeOrder
    case "set":
    case "s":
      initiativeOrder = initializeinitOrder();
      console.log("Setting current initiativeOrder for " + message.author.username);
      if (params[0] == undefined) {
        message.channel.send("No Initiative Order defined.  ie '!init set nppnn'");
        break;
      }
      for(var i = 0; i < params[0].length; i++) {
        var mob = params[0][i];
        switch(mob) {
          case "n":
            initiativeOrder.slots.push({type: "npc"});
            break;
          case "p":
            initiativeOrder.slots.push({type: "pc"});
            break;
          default:
            break;
        }
      }
      break;
    //Reset the initiativeOrder
    case "reset":
      console.log(message.author.username + " resets the Initiative Order");
      initiativeOrder = initializeinitOrder();
      message.reply(" resets the Initiative Order");
      break;
    //advance to next Initiative slot
    case "next":
    case "n":
      if (initiativeOrder.turn + 1 > initiativeOrder.slots.length) {
        initiativeOrder.turn = 1;
        initiativeOrder.round++;
        message.channel.send("New Round!");
        if (initiativeOrder.newslots.length > 0) {
          initiativeOrder.slots = initiativeOrder.slots.concat(initiativeOrder.newslots);
          initiativeOrder = addtoinitiativeOrder(initiativeOrder);
          initiativeOrder.newslots = [];
        }
      } else {
        initiativeOrder.turn++;
      }
      break;
    //previous Initiative slot
    case "previous":
    case "p":
      if (initiativeOrder.turn == 1 && initiativeOrder.round == 1) {
        message.channel.send("Initiative is already at the starting turn!");
      } else if (initiativeOrder.turn - 1 < 1) {
        initiativeOrder.turn = initiativeOrder.slots.length;
        initiativeOrder.round--;
        message.channel.send("Previous Round!");
      } else {
        initiativeOrder.turn--;
      }
      break;
    //manually modify the initiativeOrder
    case "modify":
      console.log(initiativeOrder)
      console.log("Modifying current initiativeOrder for " + message.author.username);
      //check if numbers are used
      if (params[0] == undefined) {
        message.channel.send("No Initiative Order defined.  ie '!init set nppnn'");
        break;
      }
      initiativeOrder.slots = [];
      for(var i = 0; i < params[0].length; i++) {
        var mob = params[0][i];
        switch(mob) {
          case "n":
            initiativeOrder.slots.push({type: "npc"});
            break;
          case "p":
            initiativeOrder.slots.push({type: "pc"});
            break;
          default:
            break;
        }
      }
      break;
    default:
      console.log("Just printing initiativeOrder");
      break;
  }
  printinitiativeOrder(initiativeOrder, message);
  return initiativeOrder;
}

//Adds a roll to the order and sorts it
function addtoinitiativeOrder(initiativeOrder) {

  initiativeOrder.slots.sort(function(a, b) {
    var nameA = a.type
    var nameB = b.type
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  let order = ["triumph", "advantage", "success"];
  order.forEach((symbol)=>{
    initiativeOrder.slots.sort(function (a, b) {
      return a[symbol] - b[symbol];
    });
  })
  initiativeOrder.slots.reverse();
  return initiativeOrder;
}

//initializeinitOrder
function initializeinitOrder() {
  return {
    turn: 1,
    round: 1,
    slots: [],
    newslots: [],
  };
}

//Prints out Initiative Order to channel
function printinitiativeOrder(initiativeOrder, message) {
  let faces = "";
  for (var i = initiativeOrder.turn - 1; i < initiativeOrder.slots.length; i++) {
    if (initiativeOrder.slots[i].type == "npc") {
      faces += ":smiling_imp: ";
    } else if (initiativeOrder.slots[i].type == "pc") {
      faces += ":slight_smile: ";
    }
  }
  faces += ":repeat: ";
  for (var i = 0; i < initiativeOrder.turn - 1; i++) {
    if (initiativeOrder.slots[i].type == "npc") {
      faces += ":smiling_imp: ";
    } else if (initiativeOrder.slots[i].type == "pc") {
      faces += ":slight_smile: ";
    }
  }
  message.channel.send("Round: " + initiativeOrder.round + " Turn: " + initiativeOrder.turn + "\nInitiative Order: ");
  if (faces == "") return;
  message.channel.send(faces);
}

module.exports = {
    initiative: initiative,
};
