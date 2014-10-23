#! /bin/bash

SRC='ovdesktop-client'

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
    echo "Cache clear..."
  fi
  mkdir -p build/MacOSX
  cp -R atom-shell/Atom.app build/MacOSX

  PATH_APP='build/MacOSX/Atom.app/Contents/Resources/app'
  mkdir -p $PATH_APP
  cp -R $SRC/* $PATH_APP
  echo "MacOSX package created!"
fi
