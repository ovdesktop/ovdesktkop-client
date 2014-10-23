#! /bin/bash

if [ "$(uname)" == "Darwin" ]; then
  OS='Mac'
elif [ "$(expr substr $(uname -s) 1 5)" == 'Linux' ]; then
  OS='Linux'
elif [ "$(expr substr $(uname -s) 1 10)" == 'MINGW32_NT' ]; then
  OS='Cygwin'
else
  echo "Your platform ($(uname -a)) is not supported."
  exit 1
fi

if [ $OS == "Mac" ]; then
  if [ -d build ]; then
    rm -fR build
  fi
  mkdir build
  cp -R atom-shell/Atom.app build

  PATH_APP='build/Atom.app/Contents/Resources/app'
  mkdir -p $PATH_APP
  cp package.json $PATH_APP/package.json
  cp main.js $PATH_APP/main.js
  cp index.html $PATH_APP/index.html
fi
