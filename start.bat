@echo off
TITLE EotE Dice Rolling Bot
if exist node_modules (
	node start.js
) else (
	npm install
	node start.js
)
pause