#!/bin/bash

UNPUBLISHED=()
PUBLISHED=()
ERRORS=()
SKIPPED=()

publish_component() {
    f=$1
    echo "Checking if $f is publishable"
    # in components, ends with .*js (e.g. .js and .mjs) and not app.js,
    # doesn't end with /common*.*js, and doesn't follow */common/
    if [[ $f == *components/* ]] && [[ $f == *.*js ]] && [[ $f != *.app.*js ]] \
        && [[ $f != */common*.*js ]] && [[ $f != */common/* ]]
    then
        echo "attempting to publish $f"
        PD_OUTPUT=$(./pd publish "$f" --json)
        if [ "$?" -eq 0 ]
        then
            KEY=$(echo "$PD_OUTPUT" | jq -r ".key")
            echo "published $KEY"
            echo "$KEY will be added to the registry"
            curl "https://api.pipedream.com/graphql" -H "Content-Type: application/json" -H "Authorization: Bearer $PD_API_KEY" --data-binary $'{"query":"mutation($key: String!, $registry: Boolean!, $gitPath: String){\\n  setComponentRegistry(key: $key, registry: $registry, gitPath: $gitPath){\\n    savedComponent{\\n      id\\n      key\\n      gitPath\\n    }\\n  }\\n}","variables":{"key":"'"$KEY"'","registry":'"'true'"',"gitPath":"'"$f"'"}}'
            PUBLISHED+=("*$f")
        else
            ERROR=$(echo "$PD_OUTPUT" | jq -r ".error")
            ERROR_MESSAGE="$ERROR with $f"
            echo "$ERROR_MESSAGE"
            ERRORS+=("*$ERROR_MESSAGE")
            UNPUBLISHED+=("*$f")
            # add to array to spit out later
        fi
    else
        echo "$f will not be added to the registry"
        SKIPPED+=("*$f")
    fi
}

unpublished_components() {
    if [ ${#UNPUBLISHED[@]} -ne 0 ]; then
        echo "the following files were not published"
        printf '%s\n' "${UNPUBLISHED[@]}"
    fi
}

call_pd_workflow() {
    curl -X POST \
        -d "type=$1" \
        -d "skipped=${SKIPPED[*]}" \
        -d "errors=${ERRORS[*]}" \
        -d "unpublished=${UNPUBLISHED[*]}" \
        -d "published=${PUBLISHED[*]}" \
        "$ENDPOINT"
}
