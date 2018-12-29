cd "`dirname "$0"`"
if [ -d node_modules ]
then node start.js;
else
npm install;
node start.js;
fi
