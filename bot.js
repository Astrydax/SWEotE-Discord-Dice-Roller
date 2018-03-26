/*
  Developed by Astrydax, aka Royalcrown28 for vampwood
  For Custom Discord Bots please email me at Astrydax@gmail.com
*/
const functions = require('./modules/index');
const Discord = require('discord.js');
const bot = new Discord.Client();
const firebase = require('firebase');

bot.login(functions.config.token);
firebase.initializeApp(functions.firebaseconfig);

//Called When bot becomes functional
bot.on('ready', () => {
    console.log(`Bot version ${functions.version}`);
    console.log(`Logged in as ${bot.user.username}!`);
});

//Called whenever a users send a message to the server
bot.on("message", async message => {
    //Ignore messages sent by the bot
    if (message.author.bot) return;
    //Ignore messages that dont start with the command symbol
    if (!message.content.includes(functions.config.prefix)) return;
    //check to see if bot can send messages on channel
    //check to see if external emoji can be used
    if (message.channel.type !== 'dm') {
        if (!message.channel.permissionsFor(bot.user).has('USE_EXTERNAL_EMOJIS')) {
            message.channel.send(`Please enable \'Use External Emoji\' for ${bot.user.username}`);
            return;
        }
        if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return;

    }

    //Separate and create a list of parameters. A space in the message denotes a new parameter
    let params = message.content.split(' ');
    if (!message.content.startsWith(functions.config.prefix)) {
        params.forEach((param, index) => {
            if (param.startsWith(functions.config.prefix)) params = params.slice(index);
        });
    }


    //stop if there is no command
    if (params.length === 0) return;
    if (!params[0].startsWith(functions.config.prefix)) return;

    //remove user mentions
    params.forEach((param, index) => {
        if (param.includes('<') && param.includes('>')) {
            params.splice(index, 1);
        }
    });

    //create command
    let command = params[0].toLowerCase().toString().slice(1);
    params = params.slice(1);
    let sides;
    if (command.startsWith('d') && (command.length > 1) && (command !== 'destiny')) {
        sides = command.replace(/\D/g, '');
        command = 'polyhedral';
        if (!sides) return;
    }

    //make the descriptor
    let beg, end;
    let desc = [];
    params.forEach((param, index) => {
        if (param.includes('"')) {
            if (!beg) {
                beg = index;
                end = index;
            }
            else end = index;
        }
    });

    if (beg && end) {
        desc = params.slice(beg, end + 1);
        params.splice(beg, end + 1 - beg);
        desc = desc.join(' ').replace(/['"']+/g, '');
    }

    //set the rest of params to lowercase
    params = params.filter(Boolean);
    params.forEach((param, index) => params[index] = param.toLowerCase());

    console.log(`@${message.author.username} ${message.createdAt}`);
    console.log(`${command} ${params} ${desc}`);


//************************COMMANDS START HERE************************
    let channelEmoji = await functions.readData(bot, message, 'channelEmoji');
    switch (command) {
        //Ver command
        case 'ver':
            message.channel.send(`${bot.user.username}: version: ${functions.version}`);
            break;
        //Character Tracker
        case 'char':
            functions.char(bot, message, params, channelEmoji);
            break;
        // help module
        case 'help':
            functions.help(bot, message, params);
            break;
        case 'gleepglop':
        case 'species':
            functions.gleepglop(bot, message, params);
            break;
        case 'polyhedral':
            functions.polyhedral(sides, params, message);
            break;
        case 'poly':
            functions.poly(params, message);
            break;
        case 'crit':
            functions.crit(bot, message, params);
            break;
        //!shipcrit command
        case 'shipcrit':
            functions.shipcrit(bot, message, params);
            break;
        //Destiny Point Module
        case 'destiny':
        case 'd':
        case 'story':
        case 's':
            functions.destiny(bot, message, params, channelEmoji);
            break;
        // Roll the dice command
        case 'roll':
        case 'r':
            functions.roll(bot, message, params, channelEmoji, desc).roll;
            break;
        case 'reroll':
        case 'rr':
            functions.reroll(bot, message, params, channelEmoji);
            break;
        case 'initiative':
        case 'init':
        case 'i':
            functions.initiative(bot, message, params, channelEmoji);
            break;
        case 'obligation':
        case 'o':
            functions.obligation(bot, message);
            break;
        case 'swrpg':
        case 'genesys':
            functions.writeData(bot, message, 'channelEmoji', command);
            message.channel.send(`${bot.user.username} will now use ${command} dice`);
            break;
    }
    if (message.author.id === functions.config.adminID) {
        functions.admin(bot, message, params, command);
    }
});
