const jsonfile = require('jsonfile');
var textCrit = require("./crit.js").textCrit;

function char(params, characterStatus, characterList, message) {
  //setting the channel specific variables
  var channel = message.channel.id;
  var characterName = "";
  var command = params[0];
  var abandonShip = false;


  if (params[1] != undefined) {
    characterName = params[1].toUpperCase();
  }

  if (characterStatus[channel] == undefined) {
    characterStatus[channel] = {
      blankCharacter: {
        maxWound: 0,
        maxStrain: 0,
        currentWound: 0,
        currentStrain: 0,
        credits: 0,
        crit: []
      },
    };
  }

  if (characterList[channel] == undefined) {
    characterList[channel] = [];
  }

  if (command == undefined) {
    message.channel.sendMessage("Bad Command, !help char for more information");
    abandonShip = true;
  } else if (characterStatus[channel][characterName] == undefined) {
      if (command == "setup" || command == "add") {
        if (characterName == "") {
          message.channel.sendMessage("No characterName, !help char for more information");
          abandonShip = true;
        } else {
          console.log ("Setup command detected.");
        }
      } else if (command == "list") {
        console.log("List command detected.")
      } else if (command == "reset") {
        console.log("Reset command detected.")
      } else {
        message.channel.sendMessage(characterName + " has not been set up.  Please use !char setup characterName [maxWound] [maxStrain] [credits] to complete setup.");
        abandonShip = true;
      }
  }

  if (abandonShip != true) {
      switch(command) {
        case "setup":
        case "add":
          if (characterStatus[channel][characterName] != undefined) {
            message.channel.sendMessage(characterName + " already exists!");
            return;
          }
          //init the new characters stats
          console.log("Setting up " + characterName);
          characterStatus[channel][characterName] = {
            maxWound: 0,
            maxStrain: 0,
            currentWound: 0,
            currentStrain: 0,
            credits: 0,
            crit: []
          };
          characterList[channel].push(characterName);
          if (params[2] != undefined) {
            characterStatus[channel][characterName].maxWound = params[2];
          }
          if (params[3] != undefined) {
            characterStatus[channel][characterName].maxStrain = params[3];
          }
          if (params[4] != undefined) {
            characterStatus[channel][characterName].credits = params[4];
          }
          message.channel.sendMessage(characterName + "\nWounds: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound + "\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain + "\nCredits: " + characterStatus[channel][characterName].credits);
          break;

        case "wound":
        case "w":
          if (params.length < 3) {
            message.channel.sendMessage("\nWound: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound);
          //addition modifier
          } else if (params.includes("+") || params[params.length - 1][0] == "+") {
              var modifier = (params[params.length - 1]).replace(/\D/g, "");
              characterStatus[channel][characterName].currentWound = +characterStatus[channel][characterName].currentWound + +modifier;
              if (+characterStatus[channel][characterName].currentWound > 2 * +characterStatus[channel][characterName].maxWound) {
                characterStatus[channel][characterName].currentWound = 2 * +characterStatus[channel][characterName].maxWound;
              }
              message.channel.sendMessage(characterName + " takes " + modifier + " wounds.");
              message.channel.sendMessage("\nWound: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound);
          //subtraction modifier
          } else if (params.includes("-") || params[params.length - 1][0] == "-") {
              var modifier = (params[params.length - 1]).replace(/\D/g, "");
              characterStatus[channel][characterName].currentWound = +characterStatus[channel][characterName].currentWound - +modifier;
              message.channel.sendMessage(characterName + " recovers from " + modifier + " wounds.");
              if (+characterStatus[channel][characterName].currentWound < 0) {
                characterStatus[channel][characterName].currentWound = 0;
              }
              message.channel.sendMessage("\nWound: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound);
          }
          if (+characterStatus[channel][characterName].currentWound > +characterStatus[channel][characterName].maxWound) {
            message.channel.sendMessage(characterName + " is incapacitated.");
          }
          break;

        case "strain":
        case "s":
          if (params.length < 3) {
            message.channel.sendMessage("\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain);
          } else if (params.includes("+") || params[params.length - 1][0] == "+") {
            var modifier = (params[params.length - 1]).replace(/\D/g, "");
            characterStatus[channel][characterName].currentStrain = +characterStatus[channel][characterName].currentStrain + +modifier;
            message.channel.sendMessage(characterName + " takes " + modifier + " strain.");
            if (+characterStatus[channel][characterName].currentStrain > +characterStatus[channel][characterName].maxStrain) {
              characterStatus[channel][characterName].currentStrain = characterStatus[channel][characterName].maxStrain;
            }
            message.channel.sendMessage("\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain);

          } else if (params.includes("-") || params[params.length - 1][0] == "-") {
            var modifier = (params[params.length - 1]).replace(/\D/g, "");
            characterStatus[channel][characterName].currentStrain = +characterStatus[channel][characterName].currentStrain - +modifier;
            message.channel.sendMessage(characterName + " recovers " + modifier + " strain.");
            if (+characterStatus[channel][characterName].currentStrain < 0) {
              characterStatus[channel][characterName].currentStrain = 0;
            }
            message.channel.sendMessage("\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain);
          }
          if (+characterStatus[channel][characterName].currentStrain > +characterStatus[channel][characterName].maxStrain) {
            message.channel.sendMessage(characterName + " is incapacitated.");
          }
          break;

          case "crit":
            if (params.length < 3) {
              if (characterStatus[channel][characterName].crit.length == 0) message.channel.sendMessage(characterName + " has no Critical Injuries.");
              else {
                message.channel.sendMessage(characterName + " has the following Critial Injuries.");
                characterStatus[channel][characterName].crit.forEach((eachCrit)=>{
                message.channel.sendMessage("Crit " + eachCrit + ": " + textCrit(eachCrit, message));
                })
              }
            //addition modifier
            } else if (params.includes("+") || params[params.length - 1][0] == "+") {
                var modifier = (params[params.length - 1]).replace(/\D/g, "");
                characterStatus[channel][characterName].crit.push(modifier);
                message.channel.sendMessage(characterName + " has added " + "Crit " + modifier + ": " + " to his Critical Injuries.\n" +textCrit(modifier, message));
            //subtraction modifier
            } else if (params.includes("-") || params[params.length - 1][0] == "-") {
                var modifier = (params[params.length - 1]).replace(/\D/g, "");
                if (characterStatus[channel][characterName].crit.length == 0) {
                  message.channel.sendMessage(characterName + " does not currently have any Critical Injuries.");
                } else {
                  for (let i = 0; characterStatus[channel][characterName].crit.length > i; i++) {
                    if (modifier == characterStatus[channel][characterName].crit[i]) characterStatus[channel][characterName].crit.splice(i, 1);
                    message.channel.sendMessage(characterName + " has removed " + "Crit " + modifier + ": " + " from his Critical Injuries.\n"+ textCrit(modifier, message));
                    return;
                  }
              }
            }
            break;

        case "credit":
        case "credits":
        case "c":
          if (params.length < 3) {
            message.channel.sendMessage(characterName + " has " + characterStatus[channel][characterName].credits + " credits.");
          //addition modifier
          } else if (params.includes("+") || params[params.length - 1][0] == "+") {
              var modifier = (params[params.length - 1]).replace(/\D/g, "");
              characterStatus[channel][characterName].credits = +characterStatus[channel][characterName].credits + +modifier;
              message.channel.sendMessage(characterName + " gets " + modifier + " credits for a total of " + +characterStatus[channel][characterName].credits + ".");
          //subtraction modifier
          } else if (params.includes("-") || params[params.length - 1][0] == "-") {
              var modifier = (params[params.length - 1]).replace(/\D/g, "");
              if (modifier > +characterStatus[channel][characterName].credits) {
                message.channel.sendMessage(characterName + " does not have " + modifier + " credits! " + characterName + " only has " + characterStatus[channel][characterName].credits + " credits.");
              } else {
              characterStatus[channel][characterName].credits = +characterStatus[channel][characterName].credits - +modifier;
              message.channel.sendMessage(characterName + " pays " + modifier + " credits for a total of " + +characterStatus[channel][characterName].credits + ".");
            }
          }
          break;

        case "status":
          message.channel.sendMessage(characterName + "\nWounds: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound + "\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain + "\nCredits: " + characterStatus[channel][characterName].credits);
          break;

        case "remove":
          delete characterStatus[channel][characterName];
          characterList[channel].splice(characterList[channel].indexOf(characterName), 1);
          message.channel.sendMessage(characterName + " has been removed.");
          break;

        case "list":
          if (characterList[channel].length < 1) {
            message.channel.sendMessage("No characters.");
          } else {
            for (var i = 0; i < characterList[channel].length; i++) {
            characterName = characterList[channel][i];
            message.channel.sendMessage(characterName + "\nWounds: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound + "\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain + "\nCredits: " + characterStatus[channel][characterName].credits + "\nCrits: " + characterStatus[channel][characterName].crit);
            }
          }
          break;

        case "reset":
          message.channel.sendMessage("Deleting all the characters.");
          delete characterStatus[channel];
          characterList[channel] = [];
          break;

        default:
          message.channel.sendMessage("Bad Command, !help char for more information");
          break;
        }
      }
      jsonfile.writeFile("data/characterStatus.json", characterStatus);
      jsonfile.writeFile("data/characterList.json", characterList);
      return characterStatus;
    }

module.exports = {
    char: char,
};
