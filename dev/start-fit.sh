#!/usr/bin/env bash

dev/start-canary.sh http://localhost:8080/FrontPage?test > /dev/null 2>&1 &

cd fitnesse
java -jar fitnesse-standalone.jar -p 8080