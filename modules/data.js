const firebase = require('firebase');

function readData(bot, message, dataSet) {
	return new Promise(resolve => {
		let dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.channel.id}`);
		if (dataSet === 'prefix') dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.guild.id}/`);

		dbRef.once('value').then(snap => {
			let data = snap.val();
			switch (dataSet) {
				case 'prefix':
					resolve(data);
					break;
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
			if (!data) resolve({});
			resolve(data);
		}, error => {
			console.error(error);
			message.channel.send(`Error retrieving data`);
			resolve({});
		});
	});
}

function writeData(bot, message, dataSet, data) {
	return new Promise(resolve => {
			let dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.channel.id}`);
			if (dataSet === 'diceResult') dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.channel.id}/${message.author.id}`);
			if (dataSet === 'prefix') dbRef = firebase.database().ref(`${bot.user.username}/${dataSet}/${message.guild.id}/`);
			dbRef.set(data).then(error => {
				if (error) console.error(error);
				resolve()
			});
		}
	);
}


exports.readData = readData;
exports.writeData = writeData;
