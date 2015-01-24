#!/usr/bin/env python

import urllib.request
import sys
import serial
import time

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)

cmds = ['left', 'right', 'forward']
start_time = 0
read_time = 0
while True:
    try:
        code = int(ser.readline().strip().decode('utf-8'))
        read_time = time.time()
        if code > 0 and read_time - start_time > 1:
            print(cmds[code - 1])
            urllib.request.urlopen("http://10.100.250.87:1337/control/roomba/" + cmds[code - 1]).read()
            start_time = read_time
    except:
        pass
ser.close()
