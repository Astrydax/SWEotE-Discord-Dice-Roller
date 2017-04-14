/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const Discord = require("discord.js");
const config = require("./config.json");
var chalk = require("chalk");
const bot = new Discord.Client();
var print = require("./modules/printValues.js");
var destiny = require("./modules/destiny.js");
var crit = require("./modules/crit.js");
var help = require("./modules/help.js");
var char = require("./modules/char.js");
var roll = require("./modules/roll.js");
var d100 = require("./modules/d100.js");
var admin = require("./modules/admin.js");
var init = require("./modules/init.js");
bot.login(config.token);

var version = "1.5.2";

//init destinyBalance
var destinyBalance = {};

//Init the diceResult
var diceResult = {};

//init characterStatus
var characterStatus = {};

//init initiativeOrder
var initiativeOrder = {};

//Called When bot becomes functional.
bot.on("ready", () => {
  console.log(`Bot version ${version}`);
  console.log(`Logged in as ${bot.user.username}!`);

  if (config.maxRollsPerDie >= 100) {
    console.warn(chalk.white.bgRed("!!!WARNING!!! maxRollsPerDie in config.json must be set between 1-99 otherwise errors may occur in rolls"));
  }

});

//Called whenever a users send a message to the server
bot.on("message", message => {
  //Ignore messages sent by the bot
  if (message.author.bot) return;
  //Ignore messages that dont start with the command symbol
  if (!message.content.startsWith(config.prefix)) return;
  //Seperate and create a list of parameters. A space in the message denotes a new parameter
  const params = message.content.split(" ").slice(1);
  //create command
  const command = message.content.toLowerCase().split(" ").slice(0,1).toString().slice(1);
  //init the descriptor string to an empty string
  var desc = "";
  //var descArr = [];
  console.log(command + " " + params);
  var beg, end = 0;
  var begF, endF = false;
  for (var i = 0; i < params.length; i++) {
    if (params[i].includes('"')) {
      if (!begF) {
        beg = i;
        begF = true;
      } else if (begF && !endF) {
        end = i;
        endF = true;
      }
    }
  }
  //remove the text field arguments from the list of parameters before checking for dice.
  for (i = beg; i <= end + 1; i++) {
    desc += " " + params[i];
  }
  var spliceAmnt = end + 1 - beg;
  params.splice(beg, spliceAmnt);
  //remove Quotes from descriptor
  desc = desc.replace(/['"]+/g, '');
  //set the rest of params to lowercase
  if (params != undefined) {
    for (var i = 0; i < params.length; i++) {
    params[i] = params[i].toLowerCase();
  }

//************************COMMANDS START HERE************************

if (message.channel.type == "dm" || message.channel.type == "text") {
  console.log("@" + message.author.username + " " + message.createdAt);

  switch (command) {
    //Ver command
    case "ver":
      message.channel.sendMessage(bot.user.username + ": version: " + version);
      break;
    //Character Tracker
    case "char":
      char.char(params, characterStatus, message);
      break;
    // help module
    case "help":
      help.help(params, message);
      break;
    }
  }

if (message.channel.type == "text") {
  console.log("@" + message.author.username + " " + message.createdAt);

  switch (command) {
    // D100 command
    case "d100":
      d100.d100(params, message);
      break;
    //!crit command
    case "crit":
      crit.crit(params, message);
      break;
    //!shipcrit command
    case "shipcrit":
      crit.shipcrit(params, message);
      break;
    //Destiny Point Module
    case "destiny":
    case "d":
      destiny.destiny(params, destinyBalance, message);
      break;
      // Roll the dice command
    case "roll":
    case "r":
      roll.roll(params, diceResult, message, config, desc);
      break;
    case "init":
    case "i":
      init.init(params, initiativeOrder, message, diceResult, config, desc);
      break;
    }
  }
  if (message.author.id == config.adminID) {
    console.log("Master command");
    admin.admin(command, message, bot);
  }
}
});
