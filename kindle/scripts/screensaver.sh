#!/bin/bash

if [ $(lipc-get-prop com.lab126.appmgrd activeApp) == APP_ID ]; then
  # Turn on wifi if running
  lipc-set-prop com.lab126.cmd wirelessEnable 1

  # echo "Running"
else
  # Turn off screensaver if not running
  lipc-set-prop com.lab126.powerd preventScreenSaver 0

  # echo "Not running"
fi

# From https://mobileread.com/forums/showthread.php?t=200266
# Always force light off if it set to 0 (anything other than 0 is ignored)
intensity=$(cat /sys/class/backlight/max77696-bl/brightness | grep -e '[0-9]');
if [ "$intensity" = "1" ]; then
  echo -n 0 > /sys/class/backlight/max77696-bl/brightness;
fi