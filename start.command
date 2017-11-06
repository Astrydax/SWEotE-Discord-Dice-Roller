cd "`dirname "$0"`"
if [ -d node_modules ]
then node bot.js;
else
npm install;
node bot.js;
fi
