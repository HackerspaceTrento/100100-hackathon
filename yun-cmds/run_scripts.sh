#!/bin/sh
/mnt/sda1/arduino/bin/captureVideo.sh >&/dev/null &
node /mnt/sda1/arduino/node/wsclient2.js
