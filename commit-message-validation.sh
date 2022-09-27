#!/bin/bash

# This hook checks the commit starts with prefix "[NETS-*]:".

red='\033[0;31m'
default='\033[0m'
error_msg="Commit cancelled.

Your message $(cat $1) must respect the following pattern:
    [NETS-*]: Your message

For example :
    [NETS-123]: The quick brown fox jumps over the lazy dog."

if [[ ! $(cat $1) =~ ^(\[NETS-[0-9]+\]):.*$ ]]; then
    echo "$error_msg" >&2
	exit 1
fi
