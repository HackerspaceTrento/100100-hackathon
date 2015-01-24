#!/bin/sh

i=0
ip=10.100.249.72

while true
do
  if ping -q -c1 -w1 $ip >& /dev/null
  then
    echo "link up"
    sleep 10000 &
    exit 0
  else
    echo "no link"
  fi
done
