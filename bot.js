/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const Discord = require("discord.js");
const config = require("./config").config;
const initData = require("./modules/initData.json");
const firebase = require('firebase');
const chalk = require("chalk");
const bot = new Discord.Client();
const schedule = require('node-schedule');
var firebaseconfig = require("./config").firebaseconfig;
var print = require("./modules/printValues.js").print;
var destiny = require("./modules/destiny.js").destiny;
var crit = require("./modules/crit.js").crit;
var shipcrit = require("./modules/crit.js").shipcrit;
var help = require("./modules/help.js").help;
var char = require("./modules/char.js").char;
var roll = require("./modules/roll.js").roll;
var polyhedral = require("./modules/misc.js").polyhedral;
var admin = require("./modules/admin.js").admin;
var initiative = require("./modules/initiative.js").initiative;
var reroll = require("./modules/reroll.js").reroll;
var version = require("./package.json").version;
var poly = require("./modules/poly.js").poly;
var gleepglop = require("./modules/misc.js").gleepglop;
var obligation = require("./modules/obligation.js").obligation;
var statUpdate = require("./modules/misc.js").statUpdate;

bot.login(config.token);
require('events').EventEmitter.defaultMaxListeners = 0;
firebase.initializeApp(firebaseconfig);

var destinyBalance,
    diceResult,
    characterStatus,
    initiativeOrder,
    botStats,
    channelEmoji;

//Called When bot becomes functional
bot.on("ready", () => {
  console.log(`Bot version ${version}`);
  console.log(`Logged in as ${bot.user.username}!`);

  firebase.database().ref().child(`${bot.user.username}`).once('value', snap => {
    if (snap.val() == null) {
      destinyBalance = initData.destinyBalance;
      diceResult = initData.diceResult;
      characterStatus = initData.characterStatus;
      initiativeOrder = initData.initiativeOrder;
      destinyBalance = initData.destinyBalance;
      botStats = initData.botStats;
      channelEmoji = initData.channelEmoji;
      return;
    }

    if (snap.val().destinyBalance == null) destinyBalance = initData.destinyBalance;
    else destinyBalance = snap.val().destinyBalance;

    if (snap.val().diceResult == null) diceResult = initData.diceResult;
    else diceResult = snap.val().diceResult;

    if (snap.val().characterStatus == null) characterStatus = initData.characterStatus;
    else destinyBalance = characterStatus = snap.val().characterStatus;

    if (snap.val().initiativeOrder == null) initiativeOrder = initData.initiativeOrder;
    else initiativeOrder = snap.val().initiativeOrder;

    if (snap.val().destinyBalance == null) destinyBalance = initData.destinyBalance;
    else destinyBalance = snap.val().destinyBalance;

    if (snap.val().botStats == null) botStats = initData.botStats;
    else botStats = snap.val().botStats;

    if (snap.val().channelEmoji == null) channelEmoji = initData.channelEmoji;
    else channelEmoji = snap.val().channelEmoji;
  });

  let dailyJob = schedule.scheduleJob({hour: 08, minute: 00, second: 00}, () => {
    botStats = statUpdate(botStats, bot);
  });
});

//Called whenever a users send a message to the server
bot.on("message", message => {
  let channel = message.channel.id;
  var userID = message.author.id;
  //Ignore messages sent by the bot
  if (message.author.bot) return;
  //Ignore messages that dont start with the command symbol
  if (!message.content.includes(config.prefix)) return;
  //establish which emoji to use

  if (message.channel.type !== "dm") {
    if (message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS') != true) {
      message.channel.send(`Please enable \'Use External Emoji\' for ${bot.user.username}`);
      return;
    }
  }

  //Seperate and create a list of parameters. A space in the message denotes a new parameter
  if (!message.content.startsWith(config.prefix)) {
    var params = message.content.split(" ");
    for (var i=0; params.length>i; i++) {
      if (params[i].startsWith(config.prefix)) break;
    }
    params = params.slice(i);
  } else var params = message.content.split(" ");

  //create command
  if (params.length == 0) return;

  var command = params[0].toLowerCase().toString().slice(1);
  params = params.slice(1);

  if (command.startsWith('d') && (command.length > 1) && (command != 'destiny')) {
    var sides = command.replace(/\D/g, "");
    command = 'polyhedral';
  }
  //init the descriptor string to an empty string
  var desc = "";
  var beg, end = 0;
  var begF, endF = false;
  for (var i = 0; i < params.length; i++) {
    if (params[i].includes('"')) {
      if (!begF) {
        beg = i;
        end = i;
        begF = true;
      } else if (begF && !endF) {
        end = i;
        endF = true;
      }
    }
  }
  //remove the text field arguments from the list of parameters before checking for dice.
  for (i = beg; i <= end; i++) {
    desc += " " + params[i];
  }
  var spliceAmnt = end + 1 - beg;
  params.splice(beg, spliceAmnt);
  //remove Quotes from descriptor
  desc = desc.replace(/['"]+/g, '');

  //set the rest of params to lowercase
  if (params != undefined) {
    params = params.filter(Boolean);
    for (var i = 0; i < params.length; i++) {
      params[i] = params[i].toLowerCase();
    }
  }
  console.log("@" + message.author.username + " " + message.createdAt);
  console.log(command + " " + params + " " + desc);

//************************COMMANDS START HERE************************

  switch (command) {
    //Ver command
    case "ver":
      message.channel.send(bot.user.username + ": version: " + version);
      break;
    //Character Tracker
    case "char":
      botStats.char[0]++;
      characterStatus[channel] = char(params, characterStatus[channel], message, bot, channelEmoji[channel]);
      firebase.database().ref().child(`${bot.user.username}`).child('characterStatus').child(channel).set(characterStatus[channel]);
      break;
    // help module
    case "help":
      botStats.help[0]++;
      help(params, message);
      break;
    case "gleepglop":
    case "species":
      botStats.species[0]++;
      gleepglop(message);
      break;
    case "polyhedral":
      botStats.polyhedral[0]++;
      polyhedral(sides, params, message);
      break;
    case "poly":
      botStats.polyhedral[0]++;
      poly(params, message);
      break;
    case "crit":
      botStats.crit[0]++;
      crit(params, message, bot, channelEmoji[channel]);
      break;
    //!shipcrit command
    case "shipcrit":
      botStats.shipcrit[0]++;
      shipcrit(params, message, bot, channelEmoji[channel]);
      break;
    //Destiny Point Module
    case "destiny":
    case "d":
      botStats.destiny[0]++;
      destinyBalance[channel] = destiny(params, destinyBalance[channel], message, bot, channelEmoji[channel]);
      firebase.database().ref().child(`${bot.user.username}`).child('destinyBalance').child(channel).set(destinyBalance[channel]);

      break;
    // Roll the dice command
    case "roll":
    case "r":
      botStats.roll[0]++;
      if (diceResult[channel] === undefined) diceResult[channel] = {};
      diceResult[channel][userID] = roll(params, message, bot, desc, channelEmoji[channel]).roll;
      firebase.database().ref().child(`${bot.user.username}`).child('diceResult').child(channel).child(userID).set(diceResult[channel][userID]);
      break;
    case "reroll":
    case "rr":
      botStats.reroll[0]++;
      if (diceResult[channel] === undefined) diceResult[channel] = {};
      diceResult[channel][userID] = reroll(diceResult[channel][userID], params, message, bot, channelEmoji[channel]);
      firebase.database().ref().child(`${bot.user.username}`).child('diceResult').child(channel).child(userID).set(diceResult[channel][userID]);
      break;
    case "initiative":
    case "init":
    case "i":
      botStats.initiative[0]++;
      initiativeOrder[channel] = initiative(params, initiativeOrder[channel], message, bot, channelEmoji[channel]);
      firebase.database().ref().child(`${bot.user.username}`).child('initiativeOrder').child(channel).set(initiativeOrder[channel]);
      break;
    case "obligation":
    case "o":
      botStats.obligation[0]++;
      obligation(params, characterStatus[channel], message);
      break;
    case "swrpg":
    case "genesys":
      channelEmoji[channel] = command;
      firebase.database().ref().child(`${bot.user.username}`).child('channelEmoji').child(channel).set(channelEmoji[channel]);
      message.channel.send(`${bot.user.username} will now use ${command} dice`);
      break;
  }
if (message.author.id == config.adminID) {
  botStats.admin[0]++;
  admin(command, message, botStats, bot, params);
}
firebase.database().ref().child(`${bot.user.username}`).child('botStats').set(botStats);

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
  });

});
