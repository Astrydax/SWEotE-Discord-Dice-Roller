const emojiNames = require("./dice/emoji_list.json");
const path = "./modules/dice";
exports.emoji = function emoji(params, message) {
  let guild = message.guild;
  if (params[0] == "setup") {
    message.channel.sendMessage("we made it");
    message.channel.sendMessage("array length " + emojiNames.emoji.length);
    for (let i = 0; i < 1; i++) {
      if (guild.available) {
        guild.createEmoji(path + "/" + emojiNames.emoji[i] + ".png", emojiNames.emoji[i]).catch(console.error);
      }
    }
  }
}
