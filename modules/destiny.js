var print = require("./printValues.js").print;
var roll = require("./roll.js").roll;
const config = require("../config.js").config;

function destiny(params, destinyBalance, message, bot, channelEmoji) {
  let type, pointNameLight, pointNameDark = '';
  channelEmoji==='swrpg' ? (type='Destiny', pointNameLight='Lightside', pointNameDark='Darkside') : (type='Story', pointNameLight='Player', pointNameDark='GM')

  if (Object.keys(destinyBalance).length === 0) destinyBalance = initdestinyBalance();

  //!destiny commands
  var command = params[0];
  switch(command) {
    //Sets Denstiny balance per color
    case "set":
    case "s":
      destinyBalance = initdestinyBalance();
      //check if numbers are used
      if (params.length > 1) {
        if ((params[1].match(/\d+/g)) != null) {
          for (var i = 0; i < params.length; i++) {
            var color = params[i].replace(/\d/g, "");
            switch(color) {
              case "l":
                destinyBalance.light = (params[i]).replace(/\D/g, "");
                break;
              case "d":
                destinyBalance.dark = (params[i]).replace(/\D/g, "");
                break;
              default:
                break;
              }
          }
        } else {
          for(var i = 0; i < params[1].length; i++) {
            var color = params[1][i];
            switch(color) {
              case "l":
                destinyBalance.light = destinyBalance.light + 1;
                break;
              case "d":
                destinyBalance.dark = destinyBalance.dark + 1;
                break;
              default:
                break;
              }
            }
          }
        }
        break;

    //Reset the Destiny pool
    case "reset":
      destinyBalance = initdestinyBalance();
      message.reply(` resets the ${type} Points`);
      break;
    //Use a lightside from the Destiny pool
    case "light":
    case "l":
    case 'player':
    case 'p':
      if (destinyBalance.light <= 0){
        message.channel.send(`No ${pointNameLight} points available, request will be ignored`);
        break;
      } else {
        destinyBalance.light--;
        destinyBalance.dark++;
        message.reply(` uses a ${pointNameLight} point`);
        break;
      }
    //Use a darkside from the Destiny pool
    case "dark":
    case "d":
    case 'gm':
    case 'g':
      if (destinyBalance.dark <= 0){
        message.channel.send(`No ${pointNameDark} points available, request will be ignored`);
        break;
      } else {
        destinyBalance.dark--;
        destinyBalance.light++;
        message.reply(` uses a ${pointNameDark} point`);
        break;
      }
    case "roll":
    case "r":
      let destinyRoll = roll(["w"], message, bot, `${type} roll`, channelEmoji).results;
      destinyBalance.light = +destinyBalance.light + +destinyRoll.lightpip;
      destinyBalance.dark = +destinyBalance.dark + +destinyRoll.darkpip;
      break;
    default:
      break;
  }
  printdestinyBalance(destinyBalance, bot, channelEmoji, message, type);
  return destinyBalance;

  //Prints out destiny pool to channel
}

function initdestinyBalance() {
  return {
      light: 0,
      dark: 0,
      face: "",
      };
}

function printdestinyBalance(destinyBalance, bot, channelEmoji, message, type) {
  destinyBalance.face = "";
  for (var i = 1; i <= destinyBalance.light; i++) {
      destinyBalance.face += print("lightside", bot, channelEmoji);
      }
  for (var i = 1; i <= destinyBalance.dark; i++) {
      destinyBalance.face += print("darkside", bot, channelEmoji);
      }
  message.channel.send(`${type} Points: `);
  if (destinyBalance.face != "") {
    message.channel.send(destinyBalance.face);
  }
}

module.exports = {
    destiny: destiny,
};
