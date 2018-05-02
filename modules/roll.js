const config = require("../config.js").config;
const diceFaces = require('./dice.js').dice;
const dice = require("./misc.js").dice;
const printEmoji = require("./printValues.js").print;
const writeData = require('./data').writeData;

async function roll(bot, message, params, channelEmoji, desc, diceResult, diceOrder) {
    return new Promise(async resolve => {
        if (!diceResult) diceResult = initdiceResult();
        if (!params[0]) {
            message.reply('No dice rolled.');
            return;
        }
        //process each identifier and set it into an array
        if (!diceOrder) diceOrder = await processType(message, params);
        if (diceOrder === 0) return;
        //rolls each die and begins rollResults
        diceOrder.forEach((die) => {
            if (!diceResult.roll[die]) diceResult.roll[die] = [];
            diceResult.roll[die].push(rollDice(die))
        });

        //counts the symbols rolled

        diceResult = await countSymbols(diceResult, message, bot, desc, channelEmoji);
        resolve(diceResult);
        writeData(bot, message, 'diceResult', diceResult.roll);
    });
}

//init diceResult
function initdiceResult() {
    return {
        roll: {
            yellow: [],
            green: [],
            blue: [],
            red: [],
            purple: [],
            black: [],
            white: [],
            success: [],
            advantage: [],
            triumph: [],
            failure: [],
            threat: [],
            despair: [],
            lightpip: [],
            darkpip: []
        },
        results: {
            face: '',
            success: 0,
            advantage: 0,
            triumph: 0,
            failure: 0,
            threat: 0,
            despair: 0,
            lightpip: 0,
            darkpip: 0
        }
    };
}

//processes the params and give an array of the type of dice to roll
function processType(message, params) {
    return new Promise(resolve => {
        let diceOrder = [];
        if (params.length > 0) {
            if ((params[0]).match(/\d+/g)) {
                for (let i = 0; i < params.length; i++) {
                    let diceQty = (params[i]).replace(/\D/g, "");
                    let color = params[i].replace(/\d/g, "");
                    console.log(diceQty);
                    console.log(config.maxRollsPerDie);
                    if (diceQty > config.maxRollsPerDie) {
                        message.reply('Roll exceeds max roll per die limit of ' + config.maxRollsPerDie + ' . Please try again.');
                        resolve(0);
                    }
                    for (let j = 0; j < diceQty; j++) {
                        diceOrder.push(color);
                    }
                }
            } else {
                params = params.join('');
                for (let i = 0; i < params.length; i++) {
                    diceOrder.push(params[i]);
                }
            }
        } else {
            message.reply('No dice rolled.');
            resolve(0);
        }

        let finalOrder = [];
        diceOrder.forEach((die) => {
            switch (die) {
                case 'yellow':
                case 'y':
                case 'proficiency':
                case 'pro':
                    finalOrder.push('yellow');
                    break;
                case 'green':
                case 'g':
                case 'ability':
                case 'a':
                    finalOrder.push('green');
                    break;
                case 'blue':
                case 'b':
                case 'boost':
                case 'boo':
                    finalOrder.push('blue');
                    break;
                case 'red':
                case 'r':
                case 'challenge':
                case 'c':
                    finalOrder.push('red');
                    break;
                case 'purple':
                case 'p':
                case 'difficulty':
                case 'd':
                    finalOrder.push('purple');
                    break;
                case 'black':
                case 'blk':
                case 'k':
                case 's':
                case 'sb':
                case 'setback':
                    finalOrder.push('black');
                    break;
                case 'white':
                case 'w':
                case 'force':
                case 'f':
                    finalOrder.push('white');
                    break;
                case 'success':
                case 'suc':
                case '*':
                    finalOrder.push('success');
                    break;
                case 'advantage':
                case 'adv':
                case 'v':
                    finalOrder.push('advantage');
                    break;
                case 'triumph':
                case 'tri':
                case '!':
                    finalOrder.push('triumph');
                    break;
                case 'failure':
                case 'fail':
                case '-':
                    finalOrder.push('failure');
                    break;
                case 'threat':
                case 'thr':
                case 't':
                    finalOrder.push('threat');
                    break;
                case 'despair':
                case 'des':
                case '$':
                    finalOrder.push('despair');
                    break;
                case 'lightside':
                case 'lightpip':
                case 'light':
                case 'l':
                    finalOrder.push('lightpip');
                    break;
                case 'darkside':
                case 'darkpip':
                case 'dark':
                case 'n':
                    finalOrder.push('darkpip');
                    break;
                default:
                    break;
            }
        });
        resolve(finalOrder);
    });
}

//rolls one die and returns the results in an array
function rollDice(die) {
    //roll dice and match them to a side and add that face to the message
    if (!die) return;
    return dice(Object.keys(diceFaces[die]).length);
}

async function countSymbols(diceResult, message, bot, desc, channelEmoji) {
    return new Promise(resolve => {
        diceResult.results = {
            face: '',
            success: 0,
            advantage: 0,
            triumph: 0,
            failure: 0,
            threat: 0,
            despair: 0,
            lightpip: 0,
            darkpip: 0
        };
        Object.keys(diceResult.roll).forEach((color) => {
            diceResult.roll[color].forEach((number) => {
                let face = diceFaces[color][number].face;
                for (let i = 0; face.length > i; i++) {
                    switch (face[i]) {
                        case 's':
                            diceResult.results.success++;
                            break;
                        case 'a':
                            diceResult.results.advantage++;
                            break;
                        case 'r':
                            diceResult.results.triumph++;
                            diceResult.results.success++;
                            break;
                        case 'f':
                            diceResult.results.failure++;
                            break;
                        case 't':
                            diceResult.results.threat++;
                            break;
                        case 'd':
                            diceResult.results.despair++;
                            diceResult.results.failure++;
                            break;
                        case 'l':
                            diceResult.results.lightpip++;
                            break;
                        case 'n':
                            diceResult.results.darkpip++;
                            break;
                        default:
                            break;
                    }
                }
                if (color === 'success' || color === 'advantage' || color === 'triumph' || color === 'failure' || color === 'threat' || color === 'despair' || color === 'lightpip' || color === 'darkpip') face = '';
                diceResult.results.face += printEmoji(`${color}${face}`, bot, channelEmoji);
            });
        });
        printResults(diceResult.results, message, bot, desc, channelEmoji);
        resolve(diceResult);
    });
}

function printResults(diceResult, message, bot, desc, channelEmoji) {
    let response = '';
    //prints faces
    if (diceResult.face !== '') {
        if (diceResult.face.length > 1500) diceResult.face = 'Too many dice to display.';
        message.channel.send(diceResult.face);
    } else {
        message.reply("No dice rolled.");
        return;
    }
    //creates finalCount by cancelling results
    let finalCount = {};
    if (diceResult.success > diceResult.failure) finalCount.success = diceResult.success - diceResult.failure;
    if (diceResult.failure > diceResult.success) finalCount.failure = diceResult.failure - diceResult.success;
    if (diceResult.advantage > diceResult.threat) finalCount.advantage = diceResult.advantage - diceResult.threat;
    if (diceResult.threat > diceResult.advantage) finalCount.threat = diceResult.threat - diceResult.advantage;
    if (diceResult.triumph > 0) finalCount.triumph = diceResult.triumph;
    if (diceResult.despair > 0) finalCount.despair = diceResult.despair;
    if (diceResult.lightpip > 0) finalCount.lightpip = diceResult.lightpip;
    if (diceResult.darkpip > 0) finalCount.darkpip = diceResult.darkpip;

    //prints finalCount
    Object.keys(finalCount).forEach((symbol) => {
        if (finalCount[symbol] !== 0) response += printEmoji(`${symbol}`, bot, channelEmoji) + finalCount[symbol] + ' ';
    });
    if (response === '') response += 'All dice have cancelled out';
    if (diceResult.face !== '') message.reply(desc + " results:" + "\n\n\t" + response);
}

exports.roll = roll;
exports.processType = processType;
exports.rollDice = rollDice;
exports.countSymbols = countSymbols;
exports.printResults = printResults;

