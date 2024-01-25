#!/bin/sh

lipc-set-prop com.lab126.appmgrd stop com.amcolash.kindle_dashboard
sleep 3
lipc-set-prop com.lab126.appmgrd start app://com.amcolash.kindle_dashboard
