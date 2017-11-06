const config = require("../config.js").config;
const firebase = require('firebase');

var Species =
["Aleena", "Anx", "Aqualish", "Arcona", "Arkanian Offshoot", "Arkanian", "Barabel", "Bardottan", "Besalisk", "Bith", "Bothan", "Caamasi", "Cathar", "Cerean", "Chadra-Fan", "Chagrian", "Chevin", "Chiss", "Clawdite", "Corellian Human", "Dashade", "Defel", "Devaronian", "Drall", "Dressellian", "Droid", "Dug", "Duros", "Elom", "Elomin", "Ewok", "Falleen", "Farghul", "Gamorrean", "Gand", "Gank", "Givin", "Gossam", "Gotal", "Gran", "Gungan", "Herglic", "Human", "Hutt", "Iktotchi", "Ishi Tib", "Ithorian", "Jawa", "Kalleran", "Kel Dor", "Klatooinian", "Kubaz", "Kyuzo", "Lannik", "Lepi", "Mandalorian Human", "Mirialan", "Mon Calamari", "Mustafarian", "Muun", "Nagai", "Nautolan", "Neimoidian", "Nikto", "Noghri", "Ortolan", "Pantoran", "Pau'an", "Polis Massan", "Quarren", "Quermian", "Rodian", "Ryn", "Sakiyan", "Sathari", "Selkath", "Selonian", "Shistavanen", "Sluissi", "Snivvian", "Squib", "Sullustan", "Talz", "Thakwaash", "Togorian", "Togruta", "Toydarians", "Trandoshan", "Twi'lek", "Ubese", "Ugnaught", "Verpine", "Weequay", "Whiphid", "Wookiee", "Xexto", "Zabrak", "Zeltron", "Zygerrian"];

function gleepglop (message) {
  let roll = Math.floor(Math.random() * (Species.length))
  let gleepglop = Species[roll];
  message.reply("A wild " + gleepglop + " appears!")
}

function writeBotStats(botStats, time) {
  if (!(time == 'daily' || time == 'weekly' || time == 'monthly' || time == 'alltime')) return "Bad command";
  let text = "Bot stats: \n";
  text += time.toUpperCase() + ":\n";
  Object.keys(botStats[time]).forEach((stat)=> {
    let count = 0;
    if (botStats[time][stat].length > 1) count = botStats[time][stat].reduce((a, b) => a + b, 0);
    else count = botStats[time][stat];
    text += "\t" + stat + ": " + count + "\n";
  })
  text += "\n"
  return text;
}

function statUpdate(botStats, bot) {
  let text = "Yesterday's stats: \n";
  Object.keys(botStats.daily).forEach((stat)=> {
    text += "\t" + stat + ": " + botStats.daily[stat] + "\n";
  })
  if (bot.channels.get(config.dm) != undefined) bot.channels.get(config.dm).send(text);
  console.log("Performing daily botStats process!");
  Object.keys(botStats.daily).forEach((stat)=> {
    //add dailies to alltime
    botStats.alltime[stat] += botStats.daily[stat];
    //add dailies to monthly
    botStats.monthly[stat].push(botStats.daily[stat]);
    botStats.monthly[stat].shift();
    //add dailies to weekly
    botStats.weekly[stat].push(botStats.daily[stat]);
    botStats.weekly[stat].shift();
    //reset dailies
    botStats.daily[stat] = 0;
  })
  firebase.database().ref().child(`${bot.user.username}`).child('botStats').set(botStats);
  return botStats;
}

module.exports = {
    gleepglop: gleepglop,
    writeBotStats: writeBotStats,
    statUpdate: statUpdate,
};
