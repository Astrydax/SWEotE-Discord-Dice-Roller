var dice = require("./misc.js").dice;

function obligation(params, characterStatus, message) {
  let obList = [];
  if (Object.keys(characterStatus).length === 0) {
    message.channel.send("No characters found please use !char to setup");
    return;
  }
  Object.keys(characterStatus).forEach((characterName)=>{
    Object.keys(characterStatus[characterName].obligation).forEach((obName)=>{
      obList.push({ name: characterName, obligation: obName, value: characterStatus[characterName].obligation[obName] });
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
  message.channel.send("The total group obligation is " + obTotal + ". The obligation roll is " + roll + ".");

  if (roll>obTotal) {
    message.channel.send("No obligation triggered");
    return;
  }

  for (var i=0; i<obList.length; i++) {
     target += obList[i].value;
     if (target>roll) break;
  }
  message.channel.send(obList[i].name + "\'s " + obList[i].obligation + " obligation has been triggered.");
}

module.exports = {
    obligation: obligation,
};
