const firebase = require('firebase');

function readData(message, bot, dataSet, cb) {
    firebase.database().ref().child(bot.user.username).child(dataSet).child(message.channel.id).once('value').then(function(snap) {
        let data = snap.val();
        switch (dataSet) {
            case 'diceResult':
                if (data) data = snap.val()[message.author.id];
                break;
            case 'characterStatus':
                if (data) {
                    Object.keys(data).forEach((name) => {
                        if (!data[name].crit) data[name].crit = [];
                        if (!data[name].obligation) data[name].obligation = {};
                    })
                }
                break;
            default:
                break;
        }
        if (data === null) data = {};
        cb(data);
    }, function(error) {
        console.error(error);
        message.channel.send(`Error retrieving data`);
    });
}

function writeData(message, bot, dataSet, data) {
    if (dataSet === 'diceResult') firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).child(message.author.id).set(data);
    else firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).set(data);
}

exports.readData = readData;
exports.writeData = writeData;
