# SWEotE-Discord-Dice-Roller
A Discord Bot Companion for the Star Wars: Edge of the Empire RPG

#Usage
- !roll [1y 2g 3b 4blk 5r 6p 7d 7w "A Comment for this Roll"]  
  Parameters are usable in any order. 
  
  For Example:
  
    - !roll 3g 2blk "Attack on Trooper 1"
    - !roll 2blk "Attack on Trooper 1" 3g
  
  Both command structures are treated the same way by the bot.
  
#Installation and Setup

1. First you will need to have NodeJS installed on your machine. You can find the latest version [here](https://nodejs.org/en/)
2. Next create a discord account for your bot. You can do this [here](https://discordapp.com/developers/applications/me) 
  1. Click "New App"
  2. Provide a Name (this is the name people will see when the bot joins a channel) and Description
  3. Click "Create App"
  4. On the new screen click "Create a Bot User"
  5. Open Notepad
  6. Under the heading "App Bot User" you will see "Token:click to reveal" Click to reveal it and copy the resulting text and paste it in notepad. Be sure to keep this token private.
  7. Under the heading "App Details" Copy the number after "Client ID:" and paste this in notepad as well.
  8. Replace "CLIENT_ID_GOES_HERE" in the following link with the Client ID you copied in the above step https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID_GOES_HERE&scope=bot&permissions=0
  9. Paste the edited link into a web browser, select the discord server you wish to add the bot to, and click "Authorize".
3. Click "Clone or Download" at the top of this page. Click "Download Zip" and extract the files.
4. Open Config.json.example with a text editor program of your choice.
5. Replace "BOT TOKEN" with your sercret token you copied in step 2.6 
6. Save the file as "config.json" without the trailing "example".
7. Your bot is now configured and ready to launch.


