#!/bin/bash

set -e

nohup ./system_sync/liveDataSync.sh &

nohup ./system_sync/upgradableSync.sh &
