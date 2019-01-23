# FFGNDS-Discord-Dice-Roller
CREDIT: Vampwood for conceiving the bot, and SkyJedi for substantial contributions to the project.

A Discord Bot Companion for the SW:EotE, AoR, FnD, Genesys, and L5R RPG

## Usage

- !swrpg, !genesys, !l5r  switches dice and functionality between games.

## SW/Genesys commands

- !roll   rolls any combination of SWRPG/Genesys dice and returns the cancelled results

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
  - !Char duty/d CharacterName +X/-X dutyName             adds/removes duty for characterName
  - !Char inventory/i CharacterName +X/-X itemName       adds/removes inventory items for characterName
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
  - !Init Remove X: remove a slot where is is the position

- !Species/!Gleepglop: picks a random species

- !Obligation: gathers all the obligations entered with !Char and rolls to trigger

- !Reroll: modifies the previous roll
  - !Reroll Same: rolls the same pool again
  - !Reroll Add DiceIdentifiers: roll additional dice and adds them to the pool
  - !Reroll Remove DiceIdentifiers: remove random dice of the designated color
  - !Reroll Select DiceColor/DicePosition: rerolls specified dice
    ie !Reroll Select Y3 P1: rerolls only the 3rd yellow die and the 1st purple die in the current dice pool
  - !Reroll Fortune Show DiceColor/DicePosition: shows adjacent sides for the specified die
      ie !Reroll Fortune Show Y1 P2  (shows the adjacent side for the 1st yellow and 2 purple dicefaces)
  -  !Reroll Fortune Swap DiceColor/DicePosition AdjacentFace (From !Reroll Fortune Show Command): swaps the   current face for an adjacent one
      ie !Reroll Fortune Swap 2Y 3: swaps the current die face on the 2nd yellow with option 3 of the adjacent sides

- !help          Type '!help topic for further information'

  - !roll        rolls any combination of SWRPG dice and returns the canceled results
  - !destiny     sets and manages the destiny balance for the group
  - !crit        rolls a d100 with optional modifier and displays result of the critical hit
  - !shipcrit    rolls a d100 with optional modifier and displays result of the ship critical hit
  - !char        simple character stat manager
  - !help        displays help for topics
  - !init        initiative tracker and roller
  - !ver         displays bot version

## L5R commands

- !Roll: rolls any combination of L5R dice
- !Poly: rolls any combination of polyhedral dice
- !Keep: ie !keep 12 - keeps the first, second, and discards the rest of the dice
- !Add: ie !add ww - adds specified dice to previous dicepool.
- !Reroll: ie !reroll 12 - rerolls the first and second dice without modifying the rest of the dicepool
- !Help: displays help for topics  

## General Commands
  
-  !Prefix:      changes the activation prefix for the bot.
  Examples:
      prefix ^, prefix & 
      NOTE: User needs to have a higher role than the bot. 
      See more: https://support.discordapp.com/hc/en-us/articles/214836687-Role-Management-101
      
- !Invite  get an invite link for @D1-C3

- !stats     Displays # of servers/users bot is currently has.

## Patrons
- Caleb Smith
- Chad Owen
- Clynac
- Esteban Riviera
- Flobio
- Gil Colgate
- Jason Greathouse
- Joonas Moisio
- JP Sugarbroad
- Matt Langhinrichs
- Matthew R Martinez
- Michael C Hershiser
- Mitch Christenson
- Nathan Montondon
- Ohdias
- Peter Cummuskey
- Peter Por
- Scott McNeil
- Tommy R.
- triplel
- Xavi Santamaria

[Patreon](https://www.patreon.com/SkyJedi)

[Fantasy Flight Games, Genesys](https://www.fantasyflightgames.com/en/products/genesys)
