var roll = require("./roll.js").roll;
var printEmoji = require("./printValues.js").print;
const firebase = require('firebase');
const config = require("../config.js").config;
var r = 0;

function initiative(params, initiativeOrder, message, bot, channelEmoji) {
  if (Object.keys(initiativeOrder).length === 0) initiativeOrder = initializeinitOrder();
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
      handleNext(initiativeOrder, message);
      break;
    //previous Initiative slot
    case "previous":
    case "p":
      handlePrevious(initiativeOrder, message);
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
    case "kill":
    case "k":
      if (params[0] == undefined){
        message.channel.send("No characters were killed. Try !init kill npc");
        break
      }
      for(var i = 0; i < params[0].length; i++){
        var mob = params[0][i];
        switch(mob){
          case "npc":
          case "n":
            killCharacter(initiativeOrder, "npc");
            break;
          case "pc":
          case "p":
            killCharacter(initiativeOrder, "pc");
            break;
        }
      }
      break;
    case "revive":
      if (params[0] == undefined){
        message.channel.send("No characters were revived. Try !init revive pc");
        break
      }
      for(var i = 0; i < params[0].length; i++){
        var mob = params[0][i];
        switch(mob){
          case "npc":
          case "n":
            reviveCharacter(initiativeOrder, "dnpc");
            break;
          case "pc":
          case "p":
            reviveCharacter(initiativeOrder, "dpc");
            break;
        }
      }
    default:
      console.log("Just printing initiativeOrder");
      break;
  }
  printinitiativeOrder(initiativeOrder, message, bot, channelEmoji);
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
function printinitiativeOrder(initiativeOrder, message, bot, channelEmoji) {
  let faces = "";
  for (var i = initiativeOrder.turn - 1; i < initiativeOrder.slots.length; i++) {
    faces += getFace(initiativeOrder.slots[i].type, bot, channelEmoji);
  }
  faces += ":repeat:";
  for (var i = 0; i < initiativeOrder.turn - 1; i++) {
    faces += getFace(initiativeOrder.slots[i].type, bot, channelEmoji);
  }
  message.channel.send("Round: " + initiativeOrder.round + " Turn: " + initiativeOrder.turn + "\nInitiative Order: ");
  if (faces == "") return;
  message.channel.send(faces);
}

function getFace(type, bot, channelEmoji){
  switch(type){
    case "npc": // non-playable character
      return ":smiling_imp:";
    case "pc": // playable character
      return ":slight_smile:";
    case "dnpc": // dead non-playable character
    	  return printEmoji("dnpc", bot, channelEmoji);
    case "dpc": // dead playable character
    	  return printEmoji("dpc", bot, channelEmoji);
    default:
      return ""; // Always return a string. Even an empty one.
  }
}

function killCharacter(initiativeOrder, charcter){
  var slots = initiativeOrder.slots;
  for (var i = slots.length-1; i >= 0; i--) {
    if(slots[i].type === charcter){
      slots[i].type = "d" + charcter;
      return;
    }
  }
}

function reviveCharacter(initiativeOrder, deadCharacter){
  var slots = initiativeOrder.slots;
  for (var i = 0; i < slots.length; i++) {
    if(slots[i].type === deadCharacter){
      slots[i].type = deadCharacter.slice(1); // chop off the first character. (in this case, the 'd')
      return;
    }
  }
}

function handleNext(initiativeOrder, message){
  var turn = traverseTheDead(initiativeOrder.slots, initiativeOrder.turn, 1);
  if(turn == -1){
    message.channel.send("All characters are dead.");
    return; 
  }

  // If our ending turn is below our starting turn, assume that it is a new round
  if (turn < initiativeOrder.turn) {
    initiativeOrder.round++;
    message.channel.send("New Round!");
    if (initiativeOrder.newslots.length > 0) {
      initiativeOrder.slots = initiativeOrder.slots.concat(initiativeOrder.newslots);
      initiativeOrder = addtoinitiativeOrder(initiativeOrder);
      initiativeOrder.newslots = [];
    }
  }
  initiativeOrder.turn = turn; // Now actually update the turn to the new position
}

function handlePrevious(initiativeOrder, message){
  if (initiativeOrder.turn == 1 && initiativeOrder.round == 1) {
      message.channel.send("Initiative is already at the starting turn!");
  } else {
    var turn = traverseTheDead(initiativeOrder.slots, initiativeOrder.turn, -1);
    console.log("turn=", turn, "startingTurn=", initiativeOrder.turn);
    if(turn == -1){
      message.channel.send("All characters are dead.");
      return;
    // If our ending term is above our starting turn, assume that it is the previous round
    } else if( turn > initiativeOrder.turn) {
      initiativeOrder.round--;
      message.channel.send("Previous Round!");
    }
    initiativeOrder.turn = turn; // Now actully update the turn to the new position
  }
}

// The return integer is already adjusted for position offset (arrays start at 1)
// If a -1 is returned, then all players are dead
function traverseTheDead(slots, startingTurn, adjustment){
  var i = startingTurn-1; // Turns start their arrays at index 1. So we adjust here...
  var type = slots[i];
  do {
    i += adjustment;
    // Wrap around to the front if we reach the end
    if (i >= slots.length) {
      i = 0;
    }

    // Wrap around to the back if we reach the front
    if(i < 0) {
      i = slots.length-1;
    }
    type = slots[i].type;
    // If we have not circled around and found our original initative order turn,
    // assume all characters are dead. Break out of the infinite loop.
    if(i == startingTurn-1){
      return -1; // MAGIC NUMBERS!
    }
  // Keep traversing if we encounter dead characters (dnpc or dpc)
  } while (type.substr(0,1) === "d");
  return i+1; // Turns start their arrays at index 1. So we re-adjust here...
}

module.exports = {
    initiative: initiative,
};
