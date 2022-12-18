#!/bin/bash

node ./generate_open_ai_prompts_from_test_requests.js

# Find all app files that have actual code. The code we automatically generate for app files
# is 4k. Anything greater has more code than the boilerplate.
# Run the find command and store the output in a variable
output=$(gfind ../.. -regextype posix-extended -regex '.*\.app\.(js|mjs|ts)$' -type f -size +4k)

# Set the internal field separator to a newline character
IFS=$'\n'

# Split the output into an array
files=($output)

# Loop through the array of files
for file in "${files[@]}"; do
  # Run the Node.js script for each file
  node generate_app_file_prompts.js "$file"
done

cat app_file_prop_defs.txt app_file_methods.txt test_request_prompts.txt > training_data.txt
rm app_file_prop_defs.txt app_file_methods.txt test_request_prompts.txt