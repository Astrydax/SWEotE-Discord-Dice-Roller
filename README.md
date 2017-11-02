# SWEotE-Discord-Dice-Roller
CREDIT: Vampwood for conceiving the bot, and SkyJedi for substantial contributions to the project.

A Discord Bot Companion for the SW:EotE RPG

#Usage
Commands:
- !roll   rolls any combination of SWRPG dice and returns the cancelled results

  - You may add " " at the end of the line to give the roll a name like Initiative
  - Dice results and cancellations are computed by the bot so you don't have to!  
  - Only the remaining symbols will be displayed.

  DICE IDENTIFIERS
  - y/pro = Yellow/Proficiency
  - g/a = Green/Ability
  - b/boo = Blue/Boost
  - blk/k/sb/s = Black/Setback
  - r/c = Red/ Challenge
  - p/diff = Purple/ Difficulty
  - w/f = White/Force

    - note: if you use the !roll yyyggbbd method you must use the single character dice identifiers

  EXAMPLES
      - !roll yyyggbbd "Blast Him!"
      - !roll 3pro 2a 2boo 2dif 2sb "Delusions of Grandeur"
      - !roll "Get to the ship" 2y 1g 1r 1p

-  !Poly: rolls any combination of polyhedral dice with modifier

  EXAMPLES
      - !poly 1d4 2d6+1 1d100-60

- !d100   rolls a d100 with optional modifier and displays result.
  - !d100 +X
  - !d100 + X
  - !d100 -X
  - !d100 - X

- !destiny  sets and manages the Destiny Balance for the group
  - !destiny            view the destiny pool
  - !destiny roll       rolls one Force Die and adds it to current destiny pool
  - !destiny l/light    uses light side point
  - !destiny d/dark     uses dark side point
  - !destiny set #l #d  sets destiny pool
  - !destiny set lldd   sets destiny pool
  - !destiny reset      resets the destiny pool

- !crit     rolls a d100 with optional modifier and displays result of the critical hit.
  - !crit +X
  - !crit + X
  - !crit -X
  - !crit - X

- !shipcrit   rolls a d100 with optional modifier and displays result of the ship critical hit.
  - !shipcrit +X
  - !shipcrit + X
  - !shipcrit -X
  - !shipcrit - X

- !char         Simple character stat manager
  - !char setup characterName maxWound maxStrain credits  Setup a new character
  - !char wound/w characterName +X/-X                           increases/decreases wounds for characterName by X
  - !char strain/s characterName +X/-X                          increases/decreases Strain for characterName by X
  - !char credits/c characterName +X/-X                         increases/decreases credit balance for characterName by X
  - !Char Modify CharacterName +X/-X MaxStrain/MaxWounds        increases/decreases selected stat for characterName by x
  - !Char Crit CharacterName +X/-X                              adds/removes critical injuries for characterName
  - !Char obligation/o CharacterName +X/-X obligationName       adds/removes obligations for characterName
  - !char status characterName                                  current status for characterName   
  - !char remove characterName                                  removes characterName
  - !char list                                                  lists all characters
  - !char reset                                                 resets all characters

- !Init initiative tracker and roller
  - !Init: shows current initiative order
  - !Init Roll Dice NPC/PC: rolls your initiative dice and adds character to the order
  - !Init Next: moves to next initiative slot
  - !Init Previous: moves to previous initiative slot
  - !Init Set: manually set initiative order before any turns occur
  - !Init Modify: manually alter initiative order mid-round
  - !Init Reset: resets the initiative order

- !Species/!Gleepglop: picks a random species

- !Obligation: gathers all the obligations entered with !Char and rolls to trigger

- !Reroll: modifies the previous roll
  - !Reroll Same: rolls the same pool again
  - !Reroll Add DiceIdentifiers: roll additional dice and adds them to the pool
  - !Reroll Remove DiceIdentifiers: remove random dice of the designated color
  - !Reroll Select DiceColor/DicePositon: rerolls specified dice
    ie !Reroll Select Y3 P1: rerolls only the 3rd yellow die and the 1st purple die in the current dice pool

- !help          Type '!help topic for further information'

  - !roll        rolls any combination of SWRPG dice and returns the canceled results
  - !d100        rolls a d100 with optional modifier and displays result
  - !destiny     sets and manages the destiny balance for the group
  - !crit        rolls a d100 with optional modifier and displays result of the critical hit
  - !shipcrit    rolls a d100 with optional modifier and displays result of the ship critical hit
  - !char        simple character stat manager
  - !help        displays help for topics
  - !init        initiative tracker and roller
  - !ver         displays bot version

- ADMIN ONLY
  - !stats     Displays # of servers/users bot is currently has.

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
4. Type \@<username> into your channel to get you userID
5. Open config.json with a text editor program of your choice.
6. Replace "BOT TOKEN" with your bot token you copied in step 2.6 and save the file
6. Replace "ADMIN_ID" with the NUMBERS of your userID.
7. Open firebaseconfig.js and paste in your firebase Config file (console.firebase.com)
7. Your bot is now configured and ready to launch.

#Running the bot

Before you first launch the bot you need to run the file "Run this before first launch". You can't miss it. This will install all the dependencies that bot needs to run.

To run the bot, Just execute the file "EotE Dice Roller.lnk". You can copy/move this file to any location you want. However, do not move "start.bat" out of the installation folder.

#Configuration File config.json

  config.json has four properties

  1. token
    - this is the login token for your bot
  2.  adminID
    - the user discordID for the Admin
  3. prefix
    - this is the symbol the bot uses to recognize commands. This is set to "!" by default
  4. maxRollsPerDie
    - This is the max number per dice type that can be rolled in a given roll command. Set to 20 by default. Commands that don't respect the roll limit will be aborted and send an error message to the discord chat.
  5. descriptorPrenpend
    - Any text you place between the double quotes following this property will be prepended to the text provided in the comment parameter.
    Example: if "descriptorPrepend" is set to "Targeting: ", then the command !roll 2g 2blk "Soldier 1" is called, the bot will respond with:     Targeting: Soldier 1
    Astrydax roll results:    Success: 1   Threat: 1
  6.  dm
    - direct channel for botstats report
  7.  dataPath
    - optional dataPath if needed for server (pm2 is notorious for needed one or the other)

#Amazon EC2 install

  1.  Connect to your ubuntu Linux instance using SSH.

  2.  Install node  

    -  curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

    -  sudo apt-get install -y nodejs

  3.  Download and unzip lastest build
      wget https://github.com/Astrydax/SWEotE-Discord-Dice-Roller/archive/master.zip
      unzip master.zip
      cd SWEotE-Discord-Dice-Roller-master

  4.  Install npm for the bot
      npm install

  5.  Configure the bot
      sudo nano config.json

  6.  launch bot (this will launch the bot and let you close the terminal window)
      nohup nodejs bot.js &>/dev/null & disown
