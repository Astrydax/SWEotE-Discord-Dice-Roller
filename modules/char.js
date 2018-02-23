let textCrit = require("./crit.js").textCrit;

function char(params, characterStatus, message, bot, channelEmoji) {
    //setting the channel specific variables
    let characterName = "";
    let command = params[0];
    let modifier = 0;

    if (params[1]) characterName = params[1].toUpperCase();
    if (params[2]) modifier = +(params[2]).replace(/\D/g, "");
    if (!command) {
        message.channel.send("Bad Command, !help char for more information");
        return characterStatus;
    } else if (!characterStatus[characterName]) {
        if (command === "setup" || command === "add") {
            if (characterName === "") {
                message.channel.send("No characterName, !help char for more information");
                return characterName;
            } else console.log("Setup command detected.");
        }
        else if (command === "list") console.log("List command detected.");
        else if (command === "reset") console.log("Reset command detected.");
        else {
            message.channel.send(characterName + " has not been set up.  Please use !char setup characterName [maxWound] [maxStrain] [credits] to complete setup.");
            return characterStatus;
        }
    }

    switch (command) {
        case "setup":
        case "add":
            if (characterStatus[characterName]) {
                message.channel.send(characterName + " already exists!");
                break;
            }
            //init the new characters stats
            console.log("Setting up " + characterName);
            characterStatus[characterName] = {
                maxWound: 0,
                maxStrain: 0,
                currentWound: 0,
                currentStrain: 0,
                credits: 0,
                crit: [],
                obligation: {},
            };
            if (params[2]) characterStatus[characterName].maxWound = +params[2].replace(/\D/g, "");
            if (params[3]) characterStatus[characterName].maxStrain = +params[3].replace(/\D/g, "");
            if (params[4]) characterStatus[characterName].credits = +params[4].replace(/\D/g, "");
            message.channel.send(characterName + "\nWounds: " + characterStatus[characterName].currentWound + "/" + characterStatus[characterName].maxWound + "\nStrain: " + characterStatus[characterName].currentStrain + "/" + characterStatus[characterName].maxStrain + "\nCredits: " + characterStatus[characterName].credits);
            break;
        case "wound":
        case "w":
            if (params.length < 3) {
                message.channel.send("\nWound: " + characterStatus[characterName].currentWound + "/" + characterStatus[characterName].maxWound);
                break;
                //addition modifier
            } else if (params.includes("+") || params[2][0] === "+") {
                characterStatus[characterName].currentWound = +characterStatus[characterName].currentWound + +modifier;
                if (+characterStatus[characterName].currentWound > 2 * +characterStatus[characterName].maxWound) characterStatus[characterName].currentWound = 2 * +characterStatus[characterName].maxWound;
                message.channel.send(characterName + " takes " + modifier + " wounds.");
                message.channel.send("\nWound: " + characterStatus[characterName].currentWound + "/" + characterStatus[characterName].maxWound);
                //subtraction modifier
            } else if (params.includes("-") || params[2][0] === "-") {
                characterStatus[characterName].currentWound = +characterStatus[characterName].currentWound - +modifier;
                message.channel.send(characterName + " recovers from " + modifier + " wounds.");
                if (+characterStatus[characterName].currentWound < 0) characterStatus[characterName].currentWound = 0;
                message.channel.send("\nWound: " + characterStatus[characterName].currentWound + "/" + characterStatus[characterName].maxWound);
            }
            if (+characterStatus[characterName].currentWound > +characterStatus[characterName].maxWound) message.channel.send(characterName + " is incapacitated.");
            break;

        case "strain":
        case "s":
            if (params.length < 3) {
                message.channel.send("\nStrain: " + characterStatus[characterName].currentStrain + "/" + characterStatus[characterName].maxStrain);
                break;
            } else if (params.includes("+") || params[2][0] === "+") {
                characterStatus[characterName].currentStrain = +characterStatus[characterName].currentStrain + +modifier;
                message.channel.send(characterName + " takes " + modifier + " strain.");
                if (+characterStatus[characterName].currentStrain > +characterStatus[characterName].maxStrain + 1) characterStatus[characterName].currentStrain = characterStatus[characterName].maxStrain + 1;
                message.channel.send("\nStrain: " + characterStatus[characterName].currentStrain + "/" + characterStatus[characterName].maxStrain);
            } else if (params.includes("-") || params[2][0] === "-") {
                characterStatus[characterName].currentStrain = +characterStatus[characterName].currentStrain - +modifier;
                message.channel.send(characterName + " recovers " + modifier + " strain.");
                if (+characterStatus[characterName].currentStrain < 0) characterStatus[characterName].currentStrain = 0;
                message.channel.send("\nStrain: " + characterStatus[characterName].currentStrain + "/" + characterStatus[characterName].maxStrain);
            }
            if (+characterStatus[characterName].currentStrain > +characterStatus[characterName].maxStrain) message.channel.send(characterName + " is incapacitated.");
            break;

        case "crit":
            if (params.length < 3) {
                if (characterStatus[characterName].crit.length === 0) {
                    message.channel.send(characterName + " has no Critical Injuries.");
                    break;
                }
                else {
                    message.channel.send(characterName + " has the following Critial Injuries.");
                    characterStatus[characterName].crit.forEach((eachCrit) => {
                        message.channel.send("Crit " + eachCrit + ": " + textCrit(eachCrit, bot, channelEmoji));
                    });
                    break;
                }
                //addition modifier
            } else if (params.includes("+") || params[2][0] === "+") {
                if (characterStatus[characterName].crit === '') characterStatus[characterName].crit = [];
                characterStatus[characterName].crit.push(modifier);
                message.channel.send(characterName + " has added " + "Crit " + modifier + ": " + " to their Critical Injuries.\n" + textCrit(modifier, bot, channelEmoji));
                //subtraction modifier
            } else if (params.includes("-") || params[2][0] === "-") {
                if (characterStatus[characterName].crit.length === 0) message.channel.send(characterName + " does not currently have any Critical Injuries.");
                else {
                    for (let i = 0; characterStatus[characterName].crit.length > i; i++) {
                        if (modifier === characterStatus[characterName].crit[i]) {
                            characterStatus[characterName].crit.splice(i, 1);
                            message.channel.send(characterName + " has removed " + "Crit " + modifier + ": " + " from their Critical Injuries.\n" + textCrit(modifier, bot, channelEmoji));
                            break;
                        }
                        if (characterStatus[characterName].crit.length === i + 1) message.channel.send(characterName + " does not have " + "Crit " + modifier + " in their Critical Injuries.\n");
                    }
                }
            }
            break;

        case "obligation":
        case "o":
            let Ob;
            if (params[3]) Ob = params[3].toUpperCase();
            if (params.length < 3) {
                if (Object.keys(characterStatus[characterName].obligation).length === 0) message.channel.send(characterName + " has no Obligations.");
                else {
                    message.channel.send(characterName + " has the following Obligations.\n");
                    Object.keys(characterStatus[characterName].obligation).forEach((eachOb) => {
                        message.channel.send(eachOb + ": " + characterStatus[characterName].obligation[eachOb]);
                    });
                    break;
                }
                //addition modifier
            } else if (params.includes("+") || params[2][0] === "+") {
                if (characterStatus[characterName].obligation === '') characterStatus[characterName].obligation = {};
                if (!characterStatus[characterName].obligation[Ob]) characterStatus[characterName].obligation[Ob] = +modifier;
                else characterStatus[characterName].obligation[Ob] += +modifier;
                message.channel.send(characterName + " has added " + modifier + " to their " + Ob + " obligation, for a total of " + characterStatus[characterName].obligation[Ob] + "\n");
                //subtraction modifier
            } else if (params.includes("-") || params[2][0] === "-") {
                if (!characterStatus[characterName].obligation[Ob]) message.channel.send(characterName + " does not currently have any " + Ob + " obligation.");
                else {
                    characterStatus[characterName].obligation[Ob] -= +modifier;
                    if (characterStatus[characterName].obligation[Ob] <= 0) {
                        message.channel.send(characterName + " has removed all of their " + Ob + " obligation.\n");
                        delete characterStatus[characterName].obligation[Ob];
                        break;
                    }
                    message.channel.send(characterName + " has removed " + modifier + " from their " + Ob + " obligation, for a total of " + characterStatus[characterName].obligation[Ob] + "\n");
                    break;
                }
            }
            break;

        case "credit":
        case "credits":
        case "c":
            if (params.length < 3) {
                message.channel.send(characterName + " has " + characterStatus[characterName].credits + " credits.");
                break;
                //addition modifier
            } else if (params.includes("+") || params[2][0] === "+") {
                characterStatus[characterName].credits = +characterStatus[characterName].credits + +modifier;
                message.channel.send(characterName + " gets " + modifier + " credits for a total of " + +characterStatus[characterName].credits + ".");
                //subtraction modifier
            } else if (params.includes("-") || params[2][0] === "-") {
                if (modifier > +characterStatus[characterName].credits) message.channel.send(characterName + " does not have " + modifier + " credits! " + characterName + " only has " + characterStatus[characterName].credits + " credits.");
                else {
                    characterStatus[characterName].credits = +characterStatus[characterName].credits - +modifier;
                    message.channel.send(characterName + " pays " + modifier + " credits for a total of " + +characterStatus[characterName].credits + ".");
                }
            }
            break;

        case "status":
            let obligationText = "Obligations:\n";
            Object.keys(characterStatus[characterName].obligation).forEach((eachOb) => {
                obligationText += eachOb + ": " + characterStatus[characterName].obligation[eachOb] + "\n";
            });
            message.channel.send(characterName + "\nWounds: " + characterStatus[characterName].currentWound + "/" + characterStatus[characterName].maxWound + "\nStrain: " + characterStatus[characterName].currentStrain + "/" + characterStatus[characterName].maxStrain + "\nCredits: " + characterStatus[characterName].credits + "\nCrits: " + characterStatus[characterName].crit + "\n" + obligationText);
            break;

        case "remove":
            delete characterStatus[characterName];
            message.channel.send(characterName + " has been removed.");
            break;

        case "list":
            if (Object.keys(characterStatus).length < 1) message.channel.send("No characters.");
            else {
                Object.keys(characterStatus).forEach((characterName) => {
                    let obligationText = "Obligations:\n";
                    Object.keys(characterStatus[characterName].obligation).forEach((eachOb) => {
                        obligationText += eachOb + ": " + characterStatus[characterName].obligation[eachOb] + "\n";
                    });
                    message.channel.send(characterName + "\nWounds: " + characterStatus[characterName].currentWound + "/" + characterStatus[characterName].maxWound + "\nStrain: " + characterStatus[characterName].currentStrain + "/" + characterStatus[characterName].maxStrain + "\nCredits: " + characterStatus[characterName].credits + "\nCrits: " + characterStatus[characterName].crit + "\n" + obligationText);
                });
            }
            break;
        case "modify":
            if (params.length < 3) {
                message.channel.send("\nMaxWound: " + characterStatus[characterName].maxWound + "\nMaxStrain: " + characterStatus[characterName].maxStrain);
                break;
            }
            if (params.length < 4) {
                message.channel.send("Bad Command, !help char for more information");
                break;
            }

            let stat = "";
            if (params[3] === "maxstrain") stat = "maxStrain";
            else if (params[3] === "maxwounds") stat = "maxWound";
            else {
                message.channel.send("Bad Command, !help char for more information");
                break;
            }
            if (params.includes("+") || params[2][0] === "+") characterStatus[characterName][stat] = +characterStatus[characterName][stat] + +modifier;
            else if (params.includes("-") || params[2][0] === "-") characterStatus[characterName][stat] = +characterStatus[characterName][stat] - +modifier;
            else characterStatus[characterName][stat] = +modifier;
            message.channel.send(characterName + "\'s " + stat + " is set at " + characterStatus[characterName][stat]);
            break;

        case "reset":
            message.channel.send("Deleting all the characters.");
            characterStatus = {};
            break;

        default:
            message.channel.send("Bad Command, !help char for more information");
            break;
    }
    return characterStatus;
}

exports.char = char;
