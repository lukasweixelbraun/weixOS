#!/bin/bash

set -e

nohup ./liveDataSync.sh &

nohup ./upgradableSync.sh &
