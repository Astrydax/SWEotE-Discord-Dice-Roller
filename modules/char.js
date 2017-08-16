const jsonfile = require('jsonfile');
var textCrit = require("./crit.js").textCrit;

function char(params, characterStatus, message) {
  //setting the channel specific variables
  var channel = message.channel.id;
  var characterName = "";
  var command = params[0];
  var modifier = 0;


  if (params[1] != undefined) {
    characterName = params[1].toUpperCase();
  }
  if (params[2] != undefined) {
    var modifier = +(params[2]).replace(/\D/g, "");
  }

  if (characterStatus[channel] == undefined) {
    characterStatus[channel] = {};
  }

  if (command == undefined) {
    message.channel.sendMessage("Bad Command, !help char for more information");
    return;
  } else if (characterStatus[channel][characterName] == undefined) {
      if (command == "setup" || command == "add") {
        if (characterName == "") {
          message.channel.sendMessage("No characterName, !help char for more information");
          return;
        } else {
          console.log ("Setup command detected.");
        }
      } else if (command == "list") {
        console.log("List command detected.")
      } else if (command == "reset") {
        console.log("Reset command detected.")
      } else {
        message.channel.sendMessage(characterName + " has not been set up.  Please use !char setup characterName [maxWound] [maxStrain] [credits] to complete setup.");
        return;
      }
  }



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
          crit: [],
          obligation: {},
        };
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
          return;
        //addition modifier
      } else if (params.includes("+") || params[2][0] == "+") {
            characterStatus[channel][characterName].currentWound = +characterStatus[channel][characterName].currentWound + +modifier;
            if (+characterStatus[channel][characterName].currentWound > 2 * +characterStatus[channel][characterName].maxWound) {
              characterStatus[channel][characterName].currentWound = 2 * +characterStatus[channel][characterName].maxWound;
            }
            message.channel.sendMessage(characterName + " takes " + modifier + " wounds.");
            message.channel.sendMessage("\nWound: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound);
        //subtraction modifier
      } else if (params.includes("-") || params[2][0] == "-") {
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
          return;
        } else if (params.includes("+") || params[2][0] == "+") {
          characterStatus[channel][characterName].currentStrain = +characterStatus[channel][characterName].currentStrain + +modifier;
          message.channel.sendMessage(characterName + " takes " + modifier + " strain.");
          if (+characterStatus[channel][characterName].currentStrain > +characterStatus[channel][characterName].maxStrain) {
            characterStatus[channel][characterName].currentStrain = characterStatus[channel][characterName].maxStrain;
          }
          message.channel.sendMessage("\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain);

        } else if (params.includes("-") || params[2][0] == "-") {
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
            if (characterStatus[channel][characterName].crit.length == 0) {
              message.channel.sendMessage(characterName + " has no Critical Injuries.");
              return;
            }
            else {
              message.channel.sendMessage(characterName + " has the following Critial Injuries.");
              characterStatus[channel][characterName].crit.forEach((eachCrit)=>{
              message.channel.sendMessage("Crit " + eachCrit + ": " + textCrit(eachCrit, message));
              })
              return;
            }
          //addition modifier
          } else if (params.includes("+") || params[2][0] == "+") {
              characterStatus[channel][characterName].crit.push(modifier);
              message.channel.sendMessage(characterName + " has added " + "Crit " + modifier + ": " + " to their Critical Injuries.\n" +textCrit(modifier, message));
          //subtraction modifier
          } else if (params.includes("-") || params[2][0] == "-") {
              if (characterStatus[channel][characterName].crit.length == 0) {
                message.channel.sendMessage(characterName + " does not currently have any Critical Injuries.");
              } else {
                for (let i = 0; characterStatus[channel][characterName].crit.length > i; i++) {
                  if (modifier == characterStatus[channel][characterName].crit[i]) characterStatus[channel][characterName].crit.splice(i, 1);
                  message.channel.sendMessage(characterName + " has removed " + "Crit " + modifier + ": " + " from their Critical Injuries.\n"+ textCrit(modifier, message));
                  return;
                }
            }
          }
          break;

        case "obligation":
        case "o":
        if (params[3] != undefined) {
          var Ob = params[3].toUpperCase();
        }
          if (params.length < 3) {
            if (Object.keys(characterStatus[channel][characterName].obligation).length == 0 ) message.channel.sendMessage(characterName + " has no Obligations.");
            else {
              message.channel.sendMessage(characterName + " has the following Obligations.\n");
              Object.keys(characterStatus[channel][characterName].obligation).forEach((eachOb)=>{
              message.channel.sendMessage(eachOb + ": " + characterStatus[channel][characterName].obligation[eachOb]);
              })
              return;
            }
          //addition modifier
          } else if (params.includes("+") || params[2][0] == "+") {
              if (characterStatus[channel][characterName].obligation[Ob] == undefined) {
                characterStatus[channel][characterName].obligation[Ob] = +modifier;
              } else {
                characterStatus[channel][characterName].obligation[Ob] += +modifier;
              }
              message.channel.sendMessage(characterName + " has added " + modifier + " to their " + Ob + " obilgation, for a total of " + characterStatus[channel][characterName].obligation[Ob] + "\n");
          //subtraction modifier
          } else if (params.includes("-") || params[2][0] == "-") {
            if (characterStatus[channel][characterName].obligation[Ob] == undefined) {
                message.channel.sendMessage(characterName + " does not currently have any " + Ob + " obligation.");
              } else {
                characterStatus[channel][characterName].obligation[Ob] -= +modifier;
                if (characterStatus[channel][characterName].obligation[Ob] <= 0) {
                  message.channel.sendMessage(characterName + " has removed all of their " + Ob + " obligation.\n");
                  delete characterStatus[channel][characterName].obligation[Ob]
                  return;
                }
                message.channel.sendMessage(characterName + " has removed " + modifier + " from their " + Ob + " obligation, for a total of " + characterStatus[channel][characterName].obligation[Ob] + "\n");
                return;
                }
            }
          break;

      case "credit":
      case "credits":
      case "c":
        if (params.length < 3) {
          message.channel.sendMessage(characterName + " has " + characterStatus[channel][characterName].credits + " credits.");
          return;
        //addition modifier
        } else if (params.includes("+") || params[2][0] == "+") {
            characterStatus[channel][characterName].credits = +characterStatus[channel][characterName].credits + +modifier;
            message.channel.sendMessage(characterName + " gets " + modifier + " credits for a total of " + +characterStatus[channel][characterName].credits + ".");
        //subtraction modifier
        } else if (params.includes("-") || params[2][0] == "-") {
            if (modifier > +characterStatus[channel][characterName].credits) {
              message.channel.sendMessage(characterName + " does not have " + modifier + " credits! " + characterName + " only has " + characterStatus[channel][characterName].credits + " credits.");
            } else {
            characterStatus[channel][characterName].credits = +characterStatus[channel][characterName].credits - +modifier;
            message.channel.sendMessage(characterName + " pays " + modifier + " credits for a total of " + +characterStatus[channel][characterName].credits + ".");
          }
        }
        break;

      case "status":
        let obliagtionText = "Obligations:\n";
        Object.keys(characterStatus[channel][characterName].obligation).forEach((eachOb)=> {
          obliagtionText += eachOb + ": " + characterStatus[channel][characterName].obligation[eachOb] + "\n";
        })
        message.channel.sendMessage(characterName + "\nWounds: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound + "\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain + "\nCredits: " + characterStatus[channel][characterName].credits + "\nCrits: " + characterStatus[channel][characterName].crit + "\n" + obliagtionText);
        break;

      case "remove":
        delete characterStatus[channel][characterName];
        message.channel.sendMessage(characterName + " has been removed.");
        break;

      case "list":
        if (Object.keys(characterStatus[channel]).length < 1) {
          message.channel.sendMessage("No characters.");
        } else {
          Object.keys(characterStatus[channel]).forEach((characterName)=> {
            let obliagtionText = "Obligations:\n";
            Object.keys(characterStatus[channel][characterName].obligation).forEach((eachOb)=> {
              obliagtionText += eachOb + ": " + characterStatus[channel][characterName].obligation[eachOb] + "\n";
            });
            message.channel.sendMessage(characterName + "\nWounds: " + characterStatus[channel][characterName].currentWound + "/" + characterStatus[channel][characterName].maxWound + "\nStrain: " + characterStatus[channel][characterName].currentStrain + "/" + characterStatus[channel][characterName].maxStrain + "\nCredits: " + characterStatus[channel][characterName].credits + "\nCrits: " + characterStatus[channel][characterName].crit + "\n" + obliagtionText);
          });
        }
        break;

      case "reset":
        message.channel.sendMessage("Deleting all the characters.");
        delete characterStatus[channel];
        break;

      default:
        message.channel.sendMessage("Bad Command, !help char for more information");
        break;
      }

      jsonfile.writeFile("data/characterStatus.json", characterStatus);
      return;
    }

module.exports = {
    char: char,
};
