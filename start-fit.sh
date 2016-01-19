#!/usr/bin/env bash

nohup /Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --incognito --window-size=800,250 --window-position=700,500  http://localhost:8080/FrontPage?test &

cd fitnesse
java -jar fitnesse-standalone.jar -p 8080