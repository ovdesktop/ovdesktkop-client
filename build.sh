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
  cp -R electron/Electron.app build/MacOSX

  PATH_APP='build/MacOSX/Electron.app/Contents/Resources/app'
  mkdir -p $PATH_APP
  cp -R $SRC/* $PATH_APP
  mv build/MacOSX/Electron.app build/MacOSX/ovDesktop-client.app
  echo "MacOSX package created!"
elif [ $OS == "Linux" ]; then
  if [ -d build ]; then
    rm -fR build
    echo "Cache clear..."
  fi
  mkdir -p build/Linux
  cp -R electron/ build/Linux/

  PATH_APP='build/Linux/electron/resources/app'
  mkdir -p $PATH_APP
  cp -R $SRC/* $PATH_APP
  mv build/Linux/electron build/Linux/ovDesktop-client
  mv build/Linux/ovDesktop-client/electron build/Linux/ovDesktop-client/ovDesktop-client
  echo "Linux package created!"
fi
