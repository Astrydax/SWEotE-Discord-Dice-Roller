var chalk = require("chalk");
var print = require("./printValues.js").print;
var roll = require("./roll.js").roll;
const jsonfile = require('jsonfile');

function destiny(params, destinyBalance, message, config) {
  //setting the channel specific variable
  var channel = message.channel.id;
  if (destinyBalance[channel] == undefined) {
    destinyBalance[channel] = {
        light: 0,
        dark: 0,
        face: "",
        };
  }

  //!destiny commands
  var command = params[0];
  switch(command) {
    //Sets Denstiny balance per color
    case "set":
    case "s":
      destinyBalance[channel] = {
        light: 0,
        dark: 0,
        face: "",
        };
      console.log("Setting current Destiny Balance for " + message.author.username);
      //check if numbers are used
      if (params.length > 1) {
        if ((params[1].match(/\d+/g)) != null) {
          for (var i = 0; i < params.length; i++) {
            var color = params[i].replace(/\d/g, "");
            switch(color) {
              case "l":
                destinyBalance[channel].light = (params[i]).replace(/\D/g, "");
                break;
              case "d":
                destinyBalance[channel].dark = (params[i]).replace(/\D/g, "");
                break;
              default:
                break;
              }
          }
          printdestinyBalance();
          break;
        } else {
          for(var i = 0; i < params[1].length; i++) {
            var color = params[1][i];
            switch(color) {
              case "l":
                destinyBalance[channel].light = destinyBalance[channel].light + 1;
                break;
              case "d":
                destinyBalance[channel].dark = destinyBalance[channel].dark + 1;
                break;
              default:
                break;
            }
          }
          printdestinyBalance();
          break;
          }
        }
        printdestinyBalance();
        break;

    //Reset the Destiny pool
    case "reset":
      console.log(message.author.username + " resets the Destiny Pool");
      destinyBalance[channel] = {
            light: 0,
            dark: 0,
            face: " ",
          };
      message.reply(" resets the Destiny Pool");
      printdestinyBalance();
      break;

    //Use a lightside from the Destiny pool
    case "light":
    case "l":
      if (destinyBalance[channel].light <= 0){
      message.channel.sendMessage("No lightside points available, request will be ignored");
      printdestinyBalance();
      break;
      } else {
      console.log(message.author.username + " uses a Lightside point");
      destinyBalance[channel].light--;
      destinyBalance[channel].dark++;
      message.reply(" uses a Lightside point");
      printdestinyBalance();
      break;
      }

    //Use a darkside from the Destiny pool
    case "dark":
    case "d":
      if (destinyBalance[channel].dark <= 0){
      message.channel.sendMessage("No Darkside points available, request will be ignored");
      printdestinyBalance();
      break;
      } else {
      console.log(message.author.username + " uses a Darkside point");
      destinyBalance[channel].dark--;
      destinyBalance[channel].light++;
      message.reply(" uses a Darkside point");
      printdestinyBalance();
      break;
      }

    case "roll":
    case "r":
      console.log("Rolling Destiny for " + message.author.username);
      var destinyRoll = {
        light: 0,
        dark: 0,
        face: "",
      };
      //destinyRoll = rollWhite(1, message);
      destinyRoll = roll(["w"], destinyRoll, message, config, "Destiny roll");
      destinyBalance[channel].light = +destinyBalance[channel].light + +destinyRoll.light;
      destinyBalance[channel].dark = +destinyBalance[channel].dark + +destinyRoll.dark;
      printdestinyBalance();
      break;

    default:
      console.log("Just printing destinyBalance");
      printdestinyBalance();
      break;
  }
  return destinyBalance;

  //Prints out destiny pool to channel
  function printdestinyBalance() {
    destinyBalance[channel].face = "";
    for (var i = 1; i <= destinyBalance[channel].light; i++) {
        destinyBalance[channel].face += print("ls", message);
        }
    for (var i = 1; i <= destinyBalance[channel].dark; i++) {
        destinyBalance[channel].face += print("ds", message);
        }
    jsonfile.writeFile("data/destinyBalance.json", destinyBalance);
    message.channel.sendMessage("Destiny Pool: ")
    if (destinyBalance[channel].face != "") {
    message.channel.sendMessage(destinyBalance[channel].face);
    }
  }
}

module.exports = {
    destiny: destiny,
};
