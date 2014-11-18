#! /bin/bash

if [ "$(uname)" == "Darwin" ]; then
  URL="https://github.com/atom/atom-shell/releases/download/v0.19.2/atom-shell-v0.19.2-darwin-x64.zip"
  if [ -d "atom-shell" ]; then
    echo "atom-shell directory already exists!"
    echo "nothing to do."
  else
    echo "downloading atom-shell..."
    curl $URL -s -J -L -o atom-shell.zip
    unzip -q atom-shell.zip -d atom-shell
    rm atom-shell.zip
    echo "done!"
    # Replace dock icon
    cp ovdesktop-client/img/ovdesktop-icon.icns atom-shell/Atom.app/Contents/Resources/atom.icns
  fi
  echo "Run: ./atom-shell/Atom.app/Contents/MacOS/Atom ovdesktop-client"

elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  URL="https://github.com/atom/atom-shell/releases/download/v0.19.2/atom-shell-v0.19.2-linux-x64.zip"
  if [ -d "atom-shell" ]; then
    echo "atom-shell directory already exists!"
    echo "nothing to do."
  else
    echo "downloading atom-shell..."
    wget -q $URL -O atom-shell.zip
    unzip -q atom-shell.zip -d atom-shell
    rm atom-shell.zip
    echo "done!"
  fi
  echo "Run: ./atom-shell/atom ovdesktop-client"
fi
