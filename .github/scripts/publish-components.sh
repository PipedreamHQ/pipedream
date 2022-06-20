#!/bin/bash

# import script
DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
. "$DIR/publish-functions.sh"

# create array for modified files
mapfile -d ',' -t added_modified_renamed_files < <(printf '%s,%s' "$ADDED_MODIFIED" "$RENAMED")

# attempt to publish each component
for f in "${added_modified_renamed_files[@]}"; do
    publish_component "$f"
done

# print out everything that didn't publish
unpublished_components

# curl with form
call_pd_workflow "javascript" "$PR_STUFF"
