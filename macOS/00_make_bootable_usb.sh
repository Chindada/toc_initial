#!/bin/bash

diskutil list
diskutil eraseDisk JHFS+ transcend32 disk2

"/Applications/Install macOS Big Sur.app/Contents/Resources/createinstallmedia" --volume /Volumes/transcend32