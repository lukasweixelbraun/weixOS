#!/bin/sh

set -e

UPGRADABLE_PACKAGES=`apt list --upgradable | wc -l`

# Files to Upgrade
echo "Upgradable Packages: $UPGRADABLE_PACKAGES"
echo ""

# Disk Space of live-disk
df -h /mnt/live-drive --output=source,fstype,size,used,avail,pcent
echo ""

# Get Temperature, Memory and Disk
landscape-sysinfo --sysinfo-plugins="Temperature, Memory, Disk" | sed -E 's/(   )+/\n/' | sed -e 's/^[ \t]*//'
echo ""

# Get System Info
screenfetch -Nn | sed -e 's/^[ \t]*//' | sed ':a;N;$!ba;s/\n\n/\n/g'

