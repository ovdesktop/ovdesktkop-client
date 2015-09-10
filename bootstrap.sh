#! /bin/bash

if [ "$(uname)" == "Darwin" ]; then
  URL="https://github.com/atom/electron/releases/download/v0.30.2/electron-v0.30.2-darwin-x64.zip"
  if [ -d "electron" ]; then
    echo "electron directory already exists!"
    echo "nothing to do."
  else
    echo "downloading electron..."
    curl $URL -s -J -L -o electron.zip
    unzip -q electron.zip -d electron
    rm electron.zip
    echo "done!"
    # Replace dock icon
    cp ovdesktop-client/img/ovdesktop-icon.icns electron/Electron.app/Contents/Resources/electron.icns
  fi
  echo "Run: ./electron/Electron.app/Contents/MacOS/Electron ovdesktop-client"

elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  URL="https://github.com/atom/electron/releases/download/v0.32.1/electron-v0.32.1-linux-x64.zip"
  if [ -d "electron" ]; then
    echo "electron directory already exists!"
    echo "nothing to do."
  else
    echo "downloading electron..."
    wget -q $URL -O electron.zip
    unzip -q electron.zip -d electron
    rm electron.zip
    echo "done!"
  fi
  echo "Run: ./electron/electron ovdesktop-client"
fi
