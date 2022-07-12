#!/bin/bash

commit_contained_components_that_did_not_modify_version=0

for f in ${{ steps.changed_files.outputs.all }}
do
  ext="${f##*.}"
  # Only run this check on modified sources or actions, excluding common files
  if ([[ "$ext" == "js" ]] || [[ "$ext" == "mjs" ]] || [[ "$ext" == "ts" ]]) && \
    ([[ "${f}" == *components/**/sources/* ]] || [[ "${f}" == *components/**/actions/* ]]) && [[ "${f}" != *common*.*ts ]] && \
    [[ "${f}" != *common*.*js ]] && [[ "${f}" != **/actions/common/* ]] && [[ "${f}" != **/sources/common/* ]] && \
    [[ "$(<${f})" == *"version:"* ]]
  then
    BASE_COMMIT=${{env.base_commit}}
    HEAD_COMMIT=${{env.head_commit}}
    DIFF=`git diff --unified=0 $BASE_COMMIT...$HEAD_COMMIT ${f}`
    if [[ ${DIFF} != *"version:"* ]]
    then
      BASE_COMMIT=${{env.base_commit}}
      HEAD_COMMIT=${{env.head_commit}}
      DIFF=`git diff --unified=0 $BASE_COMMIT...$HEAD_COMMIT ${f}`
      if [[ ${DIFF} != *"version:"* ]]
      then
        echo "You didn't modify the version of ${f}"
        commit_contained_components_that_did_not_modify_version=1
      fi
    fi
  fi
done

if [[ $commit_contained_components_that_did_not_modify_version -eq 1 ]]
then
  echo "You need to increment the version on some components. Please see the output above and https://pipedream.com/docs/components/guidelines/#versioning for more information"
  exit 1
fi