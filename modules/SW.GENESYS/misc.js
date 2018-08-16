const dice = require('../').dice;
let Species =
	['Aleena', 'Anx', 'Aqualish', 'Arcona', 'Arkanian Offshoot', 'Arkanian', 'Barabel', 'Bardottan', 'Besalisk', 'Bith', 'Bothan', 'Caamasi', 'Cathar', 'Cerean', 'Chadra-Fan', 'Chagrian', 'Chevin', 'Chiss', 'Clawdite', 'Corellian Human', 'Dashade', 'Defel', 'Devaronian', 'Drall', 'Dressellian', 'Droid', 'Dug', 'Duros', 'Elom', 'Elomin', 'Ewok', 'Falleen', 'Farghul', 'Gamorrean', 'Gand', 'Gank', 'Givin', 'Gossam', 'Gotal', 'Gran', 'Gungan', 'Herglic', 'Human', 'Hutt', 'Iktotchi', 'Ishi Tib', 'Ithorian', 'Jawa', 'Kalleran', 'Kel Dor', 'Klatooinian', 'Kubaz', 'Kyuzo', 'Lannik', 'Lepi', 'Mandalorian Human', 'Mirialan', 'Mon Calamari', 'Mustafarian', 'Muun', 'Nagai', 'Nautolan', 'Neimoidian', 'Nikto', 'Noghri', 'Ortolan', 'Pantoran', 'Pau\'an', 'Polis Massan', 'Quarren', 'Quermian', 'Rodian', 'Ryn', 'Sakiyan', 'Sathari', 'Selkath', 'Selonian', 'Shistavanen', 'Sluissi', 'Snivvian', 'Squib', 'Sullustan', 'Talz', 'Thakwaash', 'Togorian', 'Togruta', 'Toydarians', 'Trandoshan', `Twi\'lek`, 'Ubese', 'Ugnaught', 'Verpine', 'Weequay', 'Whiphid', 'Wookiee', 'Xexto', 'Zabrak', 'Zeltron', 'Zygerrian'];

function gleepglop(bot, message) {
	message.reply(`A wild ${Species[dice(Species.length)]} appears!`)
}

exports.gleepglop = gleepglop;

