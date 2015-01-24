#!/bin/sh

i=0
ip=10.100.250.87

while true
do
  if ping -q -c1 -w1 $ip >& /dev/null
  #if dmesg | grep "wlan0: associated"
  #if netstat -ntlp  | grep ":22"
  then
    echo "$RANDOM link up" >>/tmp/waitip.log
    sleep 10
    exit 0
  else
    echo "no link"
    #sleep 1
  fi
done
