#!/bin/bash

IFS=$'\n'
echo "The following files will be published on merge:"
# Remove initial tsc output
for f in $(cat files.txt | sed 1,3d)
do
echo "$f"
done
UNPUBLISHED=()
PUBLISHED=()
ERRORS=()
SKIPPED=()
# included in the components dir, ends with .*js (e.g. .js and .mjs) and not app.js,
# doesn't end with /common*.*js, and doesn't follow */common/
for f in $(cat files.txt | sed 1,3d); do
echo "Checking if $f is publishable"
if [[ $f == */components/* ]] && [[ $f == *.*js ]] && [[ $f != *.app.*js ]] \
    && [[ $f != */common*.*js ]] && [[ $f != */common/* ]]
then
    echo "attempting to publish ${f}"
    PD_OUTPUT=`./pd publish ${f} --json`
    if [ $? -eq 0 ]
    then
    KEY=`echo $PD_OUTPUT | jq -r ".key"`
    echo "published ${KEY}"
    echo "${KEY} will be added to the registry"
    curl "https://api.pipedream.com/graphql" -H "Content-Type: application/json" -H "Authorization: Bearer ${PD_API_KEY}" --data-binary $'{"query":"mutation($key: String!, $registry: Boolean!, $gitPath: String){\\n  setComponentRegistry(key: $key, registry: $registry, gitPath: $gitPath){\\n    savedComponent{\\n      id\\n      key\\n      gitPath\\n    }\\n  }\\n}","variables":{"key":"'${KEY}'","registry":'true',"gitPath":"'${f}'"}}'
    PUBLISHED+=("*${f}")
    else
    ERROR=`echo $PD_OUTPUT | jq -r ".error"`
    ERROR_MESSAGE="${ERROR} with ${f}"
    echo $ERROR_MESSAGE
    ERRORS+=("*${ERROR_MESSAGE}")
    UNPUBLISHED+=("*${f}")
    # add to array to spit out later
    fi
else
    echo "${f} will not be added to the registry"
    SKIPPED+=("*${f}")
fi
done
# print out everything that didn't publish
if [ ${#UNPUBLISHED[@]} -ne 0 ]; then
echo "the following files were not published"
printf '%s\n' "${UNPUBLISHED[@]}"
fi
# curl with form
curl -X POST -d "skipped=${SKIPPED}" -d "errors=${ERRORS}" -d "unpublished=${UNPUBLISHED}" -d "published=${PUBLISHED}" $ENDPOINT
unset IFS
