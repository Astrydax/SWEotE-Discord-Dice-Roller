cd "`dirname "$0"`"
[ -d backup ] || mkdir backup
cp -rf config.js backup/config.js
curl -lko master.zip https://codeload.github.com/SkyJedi/SWEotE-Discord-Dice-Roller/zip/master
unzip master.zip
rm -rf master.zip
cp -af SWEotE-Discord-Dice-Roller-master/ ./
rm -r SWEotE-Discord-Dice-Roller-master/
cp -rf backup/config.js config.js
npm update
