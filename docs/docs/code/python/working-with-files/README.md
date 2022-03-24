---
short_description: Store and read files with Python in workflows.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763737/docs/icons/icons8-opened-folder_y60u9l.svg
---

# File storage

You can also store and read files with Python steps. This means you can upload photos, retrieve datasets, accept files from an HTTP request and more.

The `/tmp` directory is accessible from your workflow steps for saving and retrieving files.

You have full access to read and write both files in `/tmp`. 

## Writing a file to /tmp

```python
import requests

# Download the Python logo
r = requests.get('https://www.python.org/static/img/python-logo@2x.png')

# Create a new file python-logo.png in the /tmp/data directory
with open('/tmp/python-logo.png', 'wb') as f:
  # Save the content of the HTTP response into the file
  f.write(r.content)
```

Now `/tmp/python-logo.png` holds the official Python logo.

## Reading a file from /tmp

You can also open files you have previously stored in the `/tmp` directory. Let's open the `python-logo.png` file.

```python
import os

with open('/tmp/python-logo.png') as f:
  # Store the contents of the file into a variable
  file_data = f.read()
```

## Listing files in /tmp

If you need to check what files are currently in `/tmp` you can list them and print the results to the **Logs** section of **Results**:

```python
import os

# Prints the files in the tmp directory
print(os.listdir('/tmp'))
```

## `/tmp` limitations

The `/tmp` directory can store up to {{$site.themeConfig.TMP_SIZE_LIMIT}} of storage. Also the storage may be wiped or may not exist between workflow executions.

To avoid errors, assume that the `/tmp` directory is empty between workflow runs. Please refer to the [disk limits](/limits/#disk) for details.
