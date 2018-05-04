const roll = require("./roll.js");
const dice = require("./misc.js").dice;
const printEmoji = require("./printValues.js").print;
const diceFaces = require('./dice.js').dice;
const readData = require('./data').readData;
const writeData = require('./data').writeData;

async function reroll(bot, message, params, channelEmoji) {
    let diceResult;
    try {
        diceResult = await readData(bot, message, 'diceResult');
    } catch (error) {
        message.reply(`That's an Error! ${error}`);
        return;
    }
    if (!diceResult) return;
    if (Object.keys(diceResult).length === 0) return;
    diceResult = {roll: diceResult};
    let target = '';
    let position = 0;
    let command = params[0];
    switch (command) {
        case "add":
            diceResult = await roll.roll(bot, message, params.slice(1), channelEmoji, 'add', diceResult);
            break;
        case "same":
            let rebuilt = [];
            Object.keys(diceResult.roll).forEach((color) => {
                diceResult.roll[color].forEach(() => rebuilt.push(color));
            });
            diceResult = await roll.roll(bot, message, params, channelEmoji, 'add', undefined, rebuilt);
            break;
        case "remove":
            target = await roll.processType(message, params.slice(1));
            if (target === 0) {
                message.reply("Bad syntax, please look at !help reroll");
                break;
            }
            let count = 0;
            target.forEach((color) => {
                if (!diceResult.roll[color] || diceResult.roll[color] === []) {
                    message.reply(`There are no more ${color} die to remove!`);
                } else {
                    let random = dice(diceResult.roll[color].length) - 1;
                    diceResult.roll[color].splice(random, 1);
                    count++;
                }
            });
            roll.countSymbols(diceResult, message, bot, `Removing ${count} Dice`, channelEmoji);
            break;
        case "select":
            if (!params[1]) {
                message.reply("Bad syntax, please look at !help reroll");
                break;
            }
            if (params[1].replace(/\D/g, "") === '') {
                message.reply("Bad syntax, please look at !help reroll");
                break;
            }
            let fortuneDice = params.slice(1);
            let text = 'Rerolling ';
            let trigger = 0;
            fortuneDice.forEach(async (die, index) => {
                let arr = await roll.processType(message, [`${die}`]);
                target = arr[0];
                position = die.replace(/\D/g, "") - 1;

                if (diceResult.roll[target] && diceResult.roll[target] !== 0 && diceResult.roll[target][position]) {
                    diceResult.roll[target].splice(position, 1, roll.rollDice(target));
                    text += `${target}${position + 1} `;
                    trigger = 1;
                }
                else message.reply(`There are no ${target} dice at position ${position + 1} to reroll`);
                if (index + 1 >= fortuneDice.length) {
                    if (trigger === 1) roll.countSymbols(diceResult, message, bot, text, channelEmoji);
                }

            });
            break;
        case "fortune":
            if (!params[1] || !params[2]) {
                message.reply("Bad syntax, please look at !help reroll");
                break;
            }
            if (params[2].replace(/\D/g, "") === '') {
                message.reply("Bad syntax, please look at !help reroll");
                break;
            }
            let fortuneCommand = params[1];
            switch (fortuneCommand) {
                case 'show':
                case 'options':
                    let fortuneDice = params.slice(2);
                    fortuneDice.forEach(async die => {
                        let arr = await roll.processType(message, [`${die}`]);
                        target = arr[0];
                        position = die.replace(/\D/g, "") - 1;
                        let emoji;
                        if (diceResult.roll[target] && diceResult.roll[target] !== 0 && diceResult.roll[target][position]) {
                            let currentRoll = diceResult.roll[target][position];
                            emoji = `${target}${diceFaces[target][currentRoll].face}`;
                            if (target === 'success' || target === 'advantage' || target === 'triumph' || target === 'failure' || target === 'threat' || target === 'despair' || target === 'lightpip' || target === 'darkpip') emoji = target;
                            let text = `${target}${position + 1} ` + printEmoji(emoji, bot, channelEmoji) + ':\n';
                            let count = 1;
                            diceFaces[target][currentRoll].adjacentposition.forEach((newRoll) => {
                                emoji = `${target}${diceFaces[target][newRoll].face}`;
                                if (target === 'success' || target === 'advantage' || target === 'triumph' || target === 'failure' || target === 'threat' || target === 'despair' || target === 'lightpip' || target === 'darkpip') emoji = target;
                                text += count + ': ' + printEmoji(emoji, bot, channelEmoji) + '  ';
                                count++
                            });
                            message.reply(text);
                        } else {
                            message.reply(`There is not a ${target} die at postion ${position + 1}`);
                        }
                    });
                    break;
                case 'swap':
                    let text = '';
                    let arr = await roll.processType(message, [params[2]]);
                    target = arr[0];
                    let trigger = 0;
                    position = params[2].replace(/\D/g, "") - 1;
                    if (diceFaces[target][diceResult.roll[target][position]].adjacentposition[params[3] - 1] === undefined) message.reply(`There is no option ${params[3]} for ${target}${position + 1}`);
                    else if (diceResult.roll[target] && diceResult.roll[target] !== 0 && diceResult.roll[target][position]) {
                        diceResult.roll[target].splice(position, 1, diceFaces[target][diceResult.roll[target][position]].adjacentposition[params[3] - 1]);
                        text += ` ${target}${position + 1} with option ${params[3]},`;
                        trigger = 1;
                    }
                    else message.reply(`There are no ${target} dice at position ${position + 1} to reroll`);
                    if (trigger === 1) {
                        text.slice(0, -1);
                        message.reply(`Replacing${text}:`);
                        roll.countSymbols(diceResult, message, bot, '', channelEmoji);
                    }
                    break;
                default:
                    break;
            }
            break;
        default:
            break
    }
    if (!diceResult) diceResult.roll = {};
    writeData(bot, message, 'diceResult', diceResult.roll);
}

module.exports = {
    reroll: reroll,
};
