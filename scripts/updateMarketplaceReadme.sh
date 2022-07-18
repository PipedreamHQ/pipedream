MARKDOWN_B64=$(base64 -w 0 $FILE_PATH)
# To run on Mac, you may need to remove the -w 0 flag

PATH_SEGMANT=$(awk -F/components '{print $(NF)}' <<< $FILE_PATH)

# If there are three segmants, the readme is for an app. 
# If there is five, it is for a component
SEGMANT_COUNT=$(awk -F/ '{print NF}' <<< $PATH_SEGMANT)

if [ $SEGMANT_COUNT -eq 3 ]; then
    # This is an app
    KEY=$(awk -F/ '{print $(NF-1)}' <<< $PATH_SEGMANT)
elif [ $SEGMANT_COUNT -eq 5 ]; then
    # This is a component
    KEY=$(awk -F/ '{print $2 "-" $4}' <<< $PATH_SEGMANT)
else
    echo Invalid file path found
    echo This readme will not be published to the Pipedream Marketplace

    exit 1
fi

curl -vv --location  --request POST "https://api.pipedream.com/graphql" \
--header "Authorization: Bearer ${PD_API_KEY}" \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation addNewMarketplaceEntry ($markdownB64: String!, $path: String!, $key: String!) {\n  marketplaceContentSet (key: $key, markdownB64: $markdownB64,\n  path: $path) {\n    marketplaceContent {\n      id\n }\n    errors\n  }    \n}","variables":{"key": "'${KEY}'", "markdownB64":"'${MARKDOWN_B64}'", "path": "'${PATH_SEGMANT}'"}}'
