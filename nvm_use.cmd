set /p version=<.nvmrc
set version= %version:~1%
echo %version%
nvm use %version%
