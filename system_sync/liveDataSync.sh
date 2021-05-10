#!/bin/bash

set -e

while true
do
	# Get Temperature, Memory and Disk
	LANDSCAPE_INFO=$(landscape-sysinfo --sysinfo-plugins="Temperature, Memory, Disk" | sed -E 's/(   )+/;/' | sed -z 's/\n/ /' | sed -e 's/^[ \t]*//')

	# Get current System CPU 
	CPU_INFO=$(top -bn1 | sed -n '/Cpu/p' | awk '{print $4}' | sed 's/..,//')

	IFS=';' read -r -a array <<< "$LANDSCAPE_INFO"

	echo "${array[0]}" > ../system_data/temp.txt
	echo "${array[1]}" > ../system_data/memory.txt
	echo "System CPU: $CPU_INFO%" > ../system_data/cpu.txt 
	
	sleep 5
done
