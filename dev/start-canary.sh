#!/usr/bin/env bash

/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --incognito --window-size=800,250 --window-position=620,600  $1  > /dev/null 2>&1 &

osascript dev/afloat-canary.scpt