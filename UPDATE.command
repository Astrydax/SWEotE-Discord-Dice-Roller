cd "`dirname "$0"`"
[ -d backup ] || mkdir backup
cp -rf config.js backup/config.js
curl -lko master.zip https://codeload.github.com/SkyJedi/FFGNDS-Discord-Dice-Roller-master/zip/master
unzip master.zip
rm -rf master.zip
cp -af FFGNDS-Discord-Dice-Roller-master/ ./
rm -r FFGNDS-Discord-Dice-Roller-master/
cp -rf backup/config.js config.js
npm update
