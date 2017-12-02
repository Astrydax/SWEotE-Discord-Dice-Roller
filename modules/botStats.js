const config = require("../config.js").config;
const firebase = require('firebase');

function init() {
  return {
      admin:[0],
      char:[0],
      crit:[0],
      shipcrit:[0],
      destiny:[0],
      help:[0],
      initiative:[0],
      obligation:[0],
      polyhedral:[0],
      reroll:[0],
      roll:[0],
      species:[0]
  };
}

function readbotStats (bot, cb) {
  firebase.database().ref().child(`${bot.user.username}`).child('botStats').once('value', snap => {
    let data = snap.val();
    if (data == null) data = init();
    cb(data);
  });
}

function track(command, bot) {
    readbotStats(bot, (data) => {
      if (data[command] !== undefined) {
        data[command][0]++;
        firebase.database().ref().child(`${bot.user.username}`).child('botStats').set(data);
      }
    });
}

function writeBotStats(bot, time, cb) {
  readbotStats(bot, (botStats) => {
    time = time.replace(/\D/g, "")
    if (!(time > 0)) return "Bad Command";
    let text = "Bot stats: \nIn the last " + time + " days:\n";
    Object.keys(botStats).forEach((stat)=> {
      let count = 0;
      for (let i=0; time>i; i++) {
        if (i >= botStats[stat].length) break;
        count = count + botStats[stat][i];
      }
      text += "\t" + stat + ": " + count + "\n";
    })
    text += "\n"
     cb(text);
  });
}

function statUpdate(bot) {
  readbotStats(bot, (botStats) => {
    let text = "Yesterday's stats: \n";
    Object.keys(botStats).forEach((stat)=> {
      text += "\t" + stat + ": " + botStats[stat][0] + "\n";
    })
    if (bot.channels.get(config.dm) != undefined) bot.channels.get(config.dm).send(text);
    console.log("Performing daily botStats process!");
    Object.keys(botStats).forEach((stat)=> {
      botStats[stat].splice(0, 0, 0);
    })
    firebase.database().ref().child(`${bot.user.username}`).child('botStats').set(botStats);
  });
}

module.exports = {
    track: track,
    writeBotStats: writeBotStats,
    statUpdate: statUpdate,
};
