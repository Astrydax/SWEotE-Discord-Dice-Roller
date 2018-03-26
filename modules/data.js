const firebase = require('firebase');

function readData(bot, message, dataSet) {
    return new Promise((resolve, reject) => {
        firebase.database().ref().child(bot.user.username).child(dataSet).child(message.channel.id).once('value').then(snap => {
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
            resolve(data);
        }, error => {
            console.error(error);
            message.channel.send(`Error retrieving data`);
            reject({});
        });
    });
}

function writeData(bot, message, dataSet, data) {
    if (dataSet === 'diceResult') firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).child(message.author.id).set(data);
    else firebase.database().ref().child(`${bot.user.username}`).child(dataSet).child(message.channel.id).set(data);
}

exports.readData = readData;
exports.writeData = writeData;
