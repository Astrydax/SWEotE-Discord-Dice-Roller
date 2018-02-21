const config = require("../config.js").config;

function print(str, bot, channelEmoji) {
    let guild = "";

    if (channelEmoji === "genesys") guild = bot.guilds.get(config.genesys);
    else guild = bot.guilds.get(config.swrpg);

    return guild.emojis.find('name', str).toString();
}

exports.print = print;
