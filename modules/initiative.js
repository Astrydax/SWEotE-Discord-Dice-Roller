let roll = require("./roll.js").roll;
const readData = require('./data').readData;
const writeData = require('./data').writeData;

async function initiative(bot, message, params, channelEmoji) {
    let initiativeOrder = await readData(bot, message, 'initiativeOrder');

    if (Object.keys(initiativeOrder).length === 0) initiativeOrder = initializeinitOrder();
    if (!initiativeOrder.newslots) initiativeOrder.newslots = [];
    if (!initiativeOrder.slots) initiativeOrder.slots = [];

    switch (params.shift()) {
        //roll for initiativeOrder
        case "roll":
        case "r":
            console.log("Rolling initiativeOrder for " + message.author.username);
            if (!params[0] || params[0] === "npc" || params[0] === "pc") {
                message.channel.send("No dice defined.  ie '!init roll yygg npc/pc'");
                break;
            }
            if (!(params[params.length - 1] === "npc" || params[params.length - 1] === "pc")) {
                message.channel.send("No Character type defined.  ie '!init roll yygg npc/pc'");
                break;
            }
            let type = params.pop();
            let diceResult = await roll(bot, message, params, channelEmoji, "Initiative roll");
            diceResult = diceResult.results;
            let rollResult = {
                success: diceResult.success,
                advantage: diceResult.advantage,
                triumph: diceResult.triumph,
                type: type
            };
            if (initiativeOrder.turn !== 1) {
                initiativeOrder.newslots.push(rollResult);
                if (type === "npc") {
                    message.channel.send(":smiling_imp: will be added to the initiative order in the next round");
                }
                if (type === "pc") {
                    message.channel.send(":slight_smile: will be added to the initiative order in the next round");
                }
            } else {
                initiativeOrder.slots.push(rollResult);
            }
            break;
        //manually set initiativeOrder
        case "set":
        case "s":
            initiativeOrder = initializeinitOrder();
            console.log("Setting current initiativeOrder for " + message.author.username);
            if (!params[0]) {
                message.channel.send("No Initiative Order defined.  ie '!init set nppnn'");
                break;
            }
            for (let i = 0; i < params[0].length; i++) {
                switch (params[0][i]) {
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
            } else initiativeOrder.turn++;
            break;
        //previous Initiative slot
        case "previous":
        case "p":
            if (initiativeOrder.turn === 1 && initiativeOrder.round === 1) {
                message.channel.send("Initiative is already at the starting turn!");
            } else if (initiativeOrder.turn - 1 < 1) {
                initiativeOrder.turn = initiativeOrder.slots.length;
                initiativeOrder.round--;
                message.channel.send("Previous Round!");
            } else initiativeOrder.turn--;
            break;
        //manually modify the initiativeOrder
        case "modify":
            console.log("Modifying current initiativeOrder for " + message.author.username);
            //check if numbers are used
            if (!params[0]) {
                message.channel.send("No Initiative Order defined.  ie '!init set nppnn'");
                break;
            }
            initiativeOrder.slots = [];
            for (let i = 0; i < params[0].length; i++) {
                switch (params[0][i]) {
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
    if (initiativeOrder.slots[0]) printinitiativeOrder(initiativeOrder, message);
    else message.channel.send('No initiative order is set!');
    writeData(bot, message, 'initiativeOrder', initiativeOrder);
}

//Adds a roll to the order and sorts it
function sortInitiativeOrder(initiativeOrder) {
    initiativeOrder.slots.sort(function (a, b) {
        let nameA = a.type;
        let nameB = b.type;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    ["triumph", "advantage", "success"].forEach((symbol) => {
        initiativeOrder.slots.sort(function (a, b) {
            if (a[symbol] < b[symbol]) return -1;
            if (a[symbol] > b[symbol]) return 1;
            return 0;
        });
    });
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
    if (Object.keys(initiativeOrder.slots[0]).length > 1) initiativeOrder = sortInitiativeOrder(initiativeOrder);
    let faces = "";
    for (let i = initiativeOrder.turn - 1; i < initiativeOrder.slots.length; i++) {
        faces += getFace(initiativeOrder.slots[i].type);
    }
    faces += ":repeat:";
    for (let i = 0; i < initiativeOrder.turn - 1; i++) {
        faces += getFace(initiativeOrder.slots[i].type);
    }
    message.channel.send("Round: " + initiativeOrder.round + " Turn: " + initiativeOrder.turn + "\nInitiative Order: ");
    if (faces === "") return;
    message.channel.send(faces);
}

function getFace(type) {
    switch (type) {
        case "npc": // non-playable character
            return ":smiling_imp:";
        case "pc": // playable character
            return ":slight_smile:";
        default:
            return ""; // Always return a string. Even an empty one.
    }
}

exports.initiative = initiative;
