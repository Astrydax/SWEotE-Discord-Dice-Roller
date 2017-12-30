# Initiative Commands

## !init
Shows the current initiative order.
``!init`` or ``!i`` can be used to start an initiative command.

## !init roll
Rolls ability/proficiency/boost die and applies it to the initiative stack  
*If* a new ``npc`` or ``pc`` is rolled after turn 1, the character will not be added to the initiative stack until after the next round.

```bash
!init <roll|r> <yellow|y|proficiency|pro|green|g|ability|a|blue|b|boost|boo> <npc|pc>
```

``npc`` will add a non-playable character to the initiative stack  
``pc`` will add a playable character to the initiative stack

## !init next
Advances the turn, skipping any dead characters.  
If we read the end of the round, advance to the next round and reset to the first turn  

```bash
!init <next|n>
```
## !init previous
Reverses the turn, skipping any dead characters.  
If we return to to the first turn, reverse the round and reset to the end of the previous round

```bash
!init <previous|p>
```

## !init set
Replaces the current initiative list with a new one. This will reset the turn and round to 1  
The order of the npc and pc will be enforced

```bash
!init <set|s> [n|p]
```
    
``n`` adds a non-playable character  
``p`` adds a playable character

## !init modify
Works exactly like ``set`` but will maintain turn and round.

```bash
!init <modify|m> [n|p]
```

``n`` adds a non-playable character  
``p`` adds a playable character

## !init reset
Clears the initiative order

```bash
!init reset
```

## !init kill
Kills a NPC or PC but keeps it in the initiative tracker as a dead character.  
The last ``npc`` or ``pc`` in the tracker will be killed, per to FFG rules.  
The order is maintained.

```bash
!init <kill|k> <pc|p|npc|n>
```

## !init revive
Brings a NPC or PC back from the dead in the initative tracker.  
The first dead ``npc`` or ``pc`` in the tracker will be brought back.

```bash
 !init revive <pc|p|npc|n>
```