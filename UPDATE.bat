@echo off
if not exist \backup mkdir backup
copy config.js backup\config.js
powershell -Command "Invoke-WebRequest https://codeload.github.com/SkyJedi/SWEotE-Discord-Dice-Roller/zip/master -OutFile master.zip"
powershell.exe -nologo -noprofile -command "& { Add-Type -A 'System.IO.Compression.FileSystem'; [IO.Compression.ZipFile]::ExtractToDirectory('master.zip', 'SWEotE-Discord-Dice-Roller-master'); }"
del /f master.zip
xcopy SWEotE-Discord-Dice-Roller-master\* .\ /e /q /y
rmdir SWEotE-Discord-Dice-Roller-master\ /s /q
copy backup\config.js config.js
npm update
pause
