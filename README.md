# SWEotE-Discord-Dice-Roller
CREDIT: Vampwood for conceiving the bot, and SkyJedi for substantial contributions to the project.

A Discord Bot Companion for the SW:EotE RPG

#Usage
- !roll [1y 2g 3b 4blk 5r 6p 7d 7w "A Comment for this Roll"]  
  Parameters are usable in any order and all parameters are optional.

  For Example:

    - !roll 3g 2blk "Attack on Trooper 1"
    - !roll 2blk "Attack on Trooper 1" 3g

  Both command structures are treated the same way by the bot.

  Dice results and cancellations are computed by the bot so you don't have to!  
  Only the remaining symbols will be displayed.
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
4. Open Config.json with a text editor program of your choice.
5. Replace "BOT TOKEN" with your bot token you copied in step 2.6 and save the file
6. Your bot is now configured and ready to launch.

#Running the bot

Before you first launch the bot you need to run the file "Run this before first launch". You can't miss it. This will install all the dependencies that bot needs to run.

To run the bot, Just execute the file "EotE Dice Roller.lnk". You can copy/move this file to any location you want. However, do not move "start.bat" out of the installation folder.

#Configuration File config.json

config.json has four properties

1. token
  - this is the login token for your bot
2. prefix
  - this is the symbol the bot uses to recognize commands. This is set to "!" by default
3. descriptorPrenpend
  - Any text you place between the double quotes following this property will be prepended to the text provided in the comment parameter.
  Example: if "descriptorPrepend" is set to "Targeting: ", then the command !roll 2g 2blk "Soldier 1" is called, the bot will respond with:     Targeting: Soldier 1
  Astrydax roll results:    Success: 1   Threat: 1
4. maxRollsPerDie
  - This is the max number per dice type that can be rolled in a given roll command. Set to 20 by default. Commands that don't respect the roll limit will be aborted and send an error message to the discord chat.

#Dice Suffixes

    y = Yellow/Proficiency
    g = Green/Ability
    b = Blue/Boost
    blk = Black/Setback
    r = Red/ Challenge
    p = Purple/ Difficulty
    d/w = White/Destiny/Force

#Amazon EC2 install

1.  Connect to your Linux instance using SSH.

2.  Install node version manager (nvm) by typing the following at the command line.

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

3.  Activate nvm by typing the following at the command line.

    . ~/.nvm/nvm.sh

4.  Use nvm to install the version of Node.js you intend to use by typing the following at the command line.

    nvm install 7.7.4

5.  Download lastest and unzip lastest build

    wget https://github.com/SkyJedi/SWEotE-Discord-Dice-Roller/archive/master.zip

    unzip master.zip

    cd SWEotE-Discord-Dice-Roller-master

6.  Install npm for the bot

    npm install

7.  Configure the bot

    sudo nano config.json

8.  launch bot

    node bot.js
