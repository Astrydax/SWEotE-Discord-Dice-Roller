var dice = require("./dice.js").dice;

function obligation(params, characterStatus, message) {
  var channel = message.channel.id;
  let obList = [];
  if (characterStatus[channel] == undefined) {
    message.channel.sendMessage("No characters found please use !char to setup");
    return;
  }
  Object.keys(characterStatus[channel]).forEach((characterName)=>{
    Object.keys(characterStatus[channel][characterName].obligation).forEach((obName)=>{
      obList.push({ name: characterName, obligation: obName, value: characterStatus[channel][characterName].obligation[obName] });
    })
  })
  obList.sort(function (a, b) {
    return a.value - b.value;
  });
  let roll = dice(100);
  let target = 0;
  let obTotal = 0;
  obList.forEach((ob)=> {
    obTotal += ob.value;
  });
  message.channel.sendMessage("The total group obligation is " + obTotal + ". The obilgation roll is " + roll + ".");

  if (roll>obTotal) {
    message.channel.sendMessage("No obligation triggered");
    return;
  }

  for (var i=0; i<obList.length; i++) {
     target += obList[i].value;
     if (target>roll) break;
  }
  message.channel.sendMessage(obList[i].name + "\'s " + obList[i].obligation + " obligation has been triggered.");
}

module.exports = {
    obligation: obligation,
};
