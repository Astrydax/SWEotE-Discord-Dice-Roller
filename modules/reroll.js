var roll = require("./roll.js");
var dice = require("./misc.js").dice;
var printEmoji = require("./printValues.js").print;
const diceFaces = require('./dice.js').dice;

function reroll(diceResult, params, message, bot, channelEmoji) {
  diceResult = {roll: diceResult};
  var target = '';
  var position = 0;
  var command = params[0];
  switch(command) {
    case "add":
      diceResult = roll.roll(params.slice(1), message, bot, 'add', channelEmoji, diceResult);
      break;
    case "same":
      let rebuilt = [];
      Object.keys(diceResult.roll).forEach((color)=> {
        diceResult.roll[color].forEach((die)=>{
          rebuilt.push(color);
        })
      });
      diceResult = roll.roll(params, message, bot, 'add', channelEmoji, undefined, rebuilt);
      break
    case "remove":
      target = roll.processType(params.slice(1), message)
      if (target == 0) {
        message.reply("Bad syntax, please look at !help reroll");
        break;
      }
      let count = 0;
      target.forEach((color)=>{
        if (diceResult.roll[color] === undefined || diceResult.roll[color] === []) {
          message.reply(`There are no more ${color} die to remove!`);
        } else {
          let random = dice(diceResult.roll[color].length)-1;
          diceResult.roll[color].splice(random, 1);
          count++;
        }
      });
      roll.countSymbols(diceResult, message, bot, `Removing ${count} Dice`, channelEmoji);
      break;
    case "select":
      if (params[1] === undefined) {
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
      fortuneDice.forEach((die)=>{
        target = roll.processType([`${die}`], message)[0];
        position = die.replace(/\D/g, "")-1;
        if (diceResult.roll[target] != undefined && diceResult.roll[target] != 0 && diceResult.roll[target][position] != undefined) {
          diceResult.roll[target].splice(position, 1, roll.rollDice(target));
          text += `${target}${position+1} `
          trigger = 1;
        }
        else message.reply(`There are no ${target} dice at position ${position+1} to reroll`);
      });
      if (trigger === 1) roll.countSymbols(diceResult, message, bot, text, channelEmoji);
      break;
    case "fortune":
      if (params[1] === undefined || params[2] === undefined) {
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
          fortuneDice.forEach((die)=>{
            target = roll.processType([`${die}`], message)[0];
            position = die.replace(/\D/g, "")-1;
            if (diceResult.roll[target] != undefined && diceResult.roll[target] != 0 && diceResult.roll[target][position] != undefined) {
              let currentRoll = diceResult.roll[target][position];
              let text = `${target}${position+1} ` + printEmoji(`${target}${diceFaces[target][currentRoll].face}`, bot, channelEmoji) + ':\n';
              let count = 1;
              diceFaces[target][currentRoll].adjacentposition.forEach((newRoll)=>{
                text += count + ': ' + printEmoji(`${target}${diceFaces[target][newRoll].face}`, bot, channelEmoji) + '  ';
                count++
              });
              message.reply(text);
            } else {
              message.reply(`There is not a ${target} die at postion ${position+1}`);
            }
          });
          break;
        case 'swap':
          let text = '';
          target = roll.processType([params[2]], message)[0];
          let trigger = 0
          position = params[2].replace(/\D/g, "")-1;
          if (diceFaces[target][diceResult.roll[target][position]].adjacentposition[params[3]-1] === undefined) message.reply(`There is no option ${params[3]} for ${target}${position+1}`);
          else if (diceResult.roll[target] != undefined && diceResult.roll[target] != 0 && diceResult.roll[target][position] != undefined) {
            diceResult.roll[target].splice(position, 1, diceFaces[target][diceResult.roll[target][position]].adjacentposition[params[3]-1]);
            text += ` ${target}${position+1} with option ${params[3]},`;
            trigger = 1;
          }
          else message.reply(`There are no ${target} dice at position ${position+1} to reroll`);
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
  if (diceResult === undefined) return {};
  else return diceResult.roll
}

module.exports = {
  reroll: reroll,
};
