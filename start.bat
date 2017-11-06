@echo off
TITLE EotE Dice Rolling Bot
if exist node_modules (
	node bot.js
) else (
	npm install
	node bot.js
)
pause