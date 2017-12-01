const firebase = require('firebase');

function readData(message, bot, dataSet, cb) {
  firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).once('value', snap => {
    let data = snap.val();
    switch (dataSet) {
      case 'diceResult':
        if (data != null) data = snap.val()[message.author.id];
        break;
      case 'characterStatus':
        if (data != null) {
            Object.keys(data).forEach((name) => {
              if (data[name].crit == undefined) data[name].crit = [];
              if (data[name].obligation == undefined) data[name].obligation = {};
            })
        }
        break;
      default:
        break;
    }
    if (data === null) data = {};
    cb(data);
  });
}

function writeData(message, bot, dataSet, data) {
  if (dataSet === 'diceResult') firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).child(message.author.id).set(data);
  else firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).set(data);
}

exports.readData = readData;
exports.writeData = writeData;
