set -e


while true
do
	UPGRADABLE_PACKAGES=`apt list --upgradable | wc -l`

	# Files to Upgrade
	echo "Upgradable Packages: $(($UPGRADABLE_PACKAGES-1))" > ./system_data/upgradable.txt

	sleep 30
done
