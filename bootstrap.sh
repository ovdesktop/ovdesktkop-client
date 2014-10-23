#! /bin/sh

OS=`uname`
URL=https://github.com/atom/atom-shell/releases/download/v0.18.2/atom-shell-v0.18.2-"$OS"-x64.zip


if [ $OS == "Darwin" ]; then
  if [ -d "atom-shell" ]; then
    echo "atom-shell directory already exists!"
    echo "nothing to do."
  else
    echo "downloading atom-shell..."
    curl $URL -s -J -L -o atom-shell.zip
    unzip -q atom-shell.zip -d atom-shell
    rm atom-shell.zip
    echo "done!"
  fi
  echo "Run: ./atom-shell/Atom.app/Contents/MacOS/Atom ."
fi
