/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const Discord = require("discord.js");
const config = require("./config").config;
const chalk = require("chalk");
const bot = new Discord.Client();
const schedule = require('node-schedule');
const firebase = require('firebase');
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
var data = require("./modules/data.js");
var botStats = require("./modules/botStats.js");

bot.login(config.token);
require('events').EventEmitter.defaultMaxListeners = 0;
firebase.initializeApp(firebaseconfig);

//Called When bot becomes functional
bot.on("ready", () => {
  console.log(`Bot version ${version}`);
  console.log(`Logged in as ${bot.user.username}!`);

  let dailyJob = schedule.scheduleJob({hour: 08, minute: 00, second: 00}, () => {
    botStats.statUpdate(bot);
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
  //check to see if bot can send messages on channel
  //check to see if external emoji can be used
  if (message.channel.type !== "dm") {
    if (message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS') != true) {
      message.channel.send(`Please enable \'Use External Emoji\' for ${bot.user.username}`);
      return;
    }
    if (message.channel.permissionsFor(bot.user).has('SEND_MESSAGES') != true) return;

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
  data.readData(message, bot, 'channelEmoji', (channelEmoji) => {
    switch (command) {
      //Ver command
      case "ver":
        message.channel.send(bot.user.username + ": version: " + version);
        break;
      //Character Tracker
      case "char":
        data.readData(message, bot, 'characterStatus', (characterStatus) => {
          characterStatus = char(params, characterStatus, message, bot);
          data.writeData(message, bot, 'characterStatus', characterStatus);
        });
        break;
      // help module
      case "help":
        help(params, message);
        break;
      case "gleepglop":
      case "species":
        gleepglop(message);
        command = 'species'
        break;
      case "polyhedral":
        polyhedral(sides, params, message);
        break;
      case "poly":
        poly(params, message);
        command = 'polyhedral';
        break;
      case "crit":
        crit(params, message, bot);
        break;
      //!shipcrit command
      case "shipcrit":
        shipcrit(params, message, bot);
        break;
      //Destiny Point Module
      case "destiny":
      case "d":
        data.readData(message, bot, 'destinyBalance', (destinyBalance) => {
          destinyBalance = destiny(params, destinyBalance, message, bot);
          data.writeData(message, bot, 'destinyBalance', destinyBalance);
        });
        command = 'destiny';
        break;
      // Roll the dice command
      case "roll":
      case "r":
        let diceResult = roll(params, message, bot, desc, channelEmoji).roll;
        data.writeData(message, bot, 'diceResult', diceResult);
        command = 'roll';
        break;
      case "reroll":
      case "rr":
        data.readData(message, bot, 'diceResult', (diceResult) => {
          diceResult = reroll(diceResult, params, message, bot, channelEmoji);
          data.writeData(message, bot, 'diceResult', diceResult);
        });
        command = 'reroll';
        break;
      case "initiative":
      case "init":
      case "i":
        data.readData(message, bot, 'initiativeOrder', (initiativeOrder) => {
          initiativeOrder = initiative(params, initiativeOrder, message, bot);
          data.writeData(message, bot, 'initiativeOrder', initiativeOrder);
        });
        command = 'initiative';
        break;
      case "obligation":
      case "o":
        data.readData(message, bot, 'characterStatus', (characterStatus) => {
          obligation(params, characterStatus, message);
        });
        command = 'obligation';
        break;
      case "swrpg":
      case "genesys":
          data.writeData(message, bot, 'channelEmoji', command);
          message.channel.send(`${bot.user.username} will now use ${command} dice`);
        break;
    }
    botStats.track(command, bot);
  });
if (message.author.id == config.adminID) {
  admin(command, message, bot, params);
}

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: \n" + err.stack);
  });

});
