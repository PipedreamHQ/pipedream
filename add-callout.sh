#!/bin/bash

# Get a list of all modified files (ensure they are '.md' files if needed)
git diff --name-only | while read filename; do
  # Check if the file extension is .md, adjust if your files have a different extension
  if [[ $filename == *.mdx ]]; then
    # Check if the file already contains the import statement to avoid duplicates
    if ! grep -q "import Callout from '@\/components\/Callout'" "$filename"; then
      # Add the import statement to the top of the file
      echo "import Callout from '@/components/Callout'\n" | cat - "$filename" > temp && mv temp "$filename"
      # Optionally, echo the filename to know which files were modified
      echo "Added import to $filename"
    fi
  fi
done

