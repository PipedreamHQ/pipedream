#!/bin/bash

# import script
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. "$DIR/publish-functions.sh"

# attempt to publish each ts component
for f in $(cat files.txt | sed 1,3d); do
    publish_component "$f"
done

# print out everything that didn't publish
unpublished_components

# curl with form
call_pd_workflow "typescript"
