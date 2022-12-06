#!/bin/bash

F=list_of_components.txt

cd ../components
for d in */ ; do
    cd $d
    if [ -d "sources" ] && [ ! -L "sources" ]; then
      cd sources
      for f in `find . -name '*.*js'`; do
        if grep -q 'key: ".*"' $f && grep -q 'version: ".*"' $f; then
          version=`grep 'version: ".*"' $f | sed -E 's/version:[[:space:]]+"(.*)",?/\1/g' | xargs`
          key=`grep 'key: ".*"' $f | sed -E 's/key:[[:space:]]+"(.*)",?/\1/g' | xargs`
          echo "$key,$version" >> ../../../scripts/$F
        fi
      done
      cd ..
    fi
    if [ -d "actions" ] && [ ! -L "actions" ]; then
      cd actions
      for f in `find . -name '*.*js'`; do
        if grep -q 'key: ".*"' $f && grep -q 'version: ".*"' $f; then
          version=`grep 'version: ".*"' $f | sed -E 's/version:[[:space:]]+"(.*)",?/\1/g' | xargs`
          key=`grep 'key: ".*"' $f | sed -E 's/key:[[:space:]]+"(.*)",?/\1/g' | xargs`
          echo "$key,$version" >> ../../../scripts/$F
        fi
      done
      cd ..
    fi
    cd ..
done
