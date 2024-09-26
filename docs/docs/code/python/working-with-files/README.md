---
short_description: Store and read files with Python in workflows.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763737/docs/icons/icons8-opened-folder_y60u9l.svg
---

# Working with the filesystem in Python

You can work with files within a workflow. For instance, downloading content from some service to upload to another. Here are some sample code for common file operations.

[[toc]]

## The `/tmp` directory

Within a workflow, you have full read-write access to the `/tmp` directory. You have {{$site.themeConfig.TMP_SIZE_LIMIT}} of available space in `/tmp` to save any file.

### Managing `/tmp` across workflow runs

The `/tmp` directory is stored on the virtual machine that runs your workflow. We call this the execution environment ("EE"). More than one EE may be created to handle high-volume workflows. And EEs can be destroyed at any time (for example, after about 10 minutes of receiving no events). This means that you should not expect to have access to files across executions. At the same time, files _may_ remain, so you should clean them up to make sure that doesn't affect your workflow. **Use [the `tempfile` module](https://docs.python.org/3/library/tempfile.html) to cleanup files after use, or [delete the files manually](#deleting-a-file).**

## Writing a file to `/tmp`

```python
import requests

def handler(pd: "pipedream"):
  # Download the Python logo
  r = requests.get("https://www.python.org/static/img/python-logo@2x.png")

  # Create a new file python-logo.png in the /tmp/data directory
  with open("/tmp/python-logo.png", "wb") as f:
    # Save the content of the HTTP response into the file
    f.write(r.content)
```

Now `/tmp/python-logo.png` holds the official Python logo.

## Reading a file from `/tmp`

You can also open files you have previously stored in the `/tmp` directory. Let's open the `python-logo.png` file.

```python
import os

def handler(pd: "pipedream"):
  with open("/tmp/python-logo.png") as f:
    # Store the contents of the file into a variable
    file_data = f.read()
```

## Listing files in `/tmp`

If you need to check what files are currently in `/tmp` you can list them and print the results to the **Logs** section of **Results**:

```python
import os

def handler(pd: "pipedream"):
  # Prints the files in the tmp directory
  print(os.listdir("/tmp"))
```

## Deleting a file

```python
import os

def handler(pd: "pipedream"):
  print(os.unlink("/tmp/your-file"))
```

## Downloading a file to `/tmp`

[See this example](/code/python/http-requests/#downloading-a-file-to-the-tmp-directory) to learn how to download a file to `/tmp`.

## Uploading a file from `/tmp`

[See this example](/code/python/http-requests/#uploading-a-file-from-the-tmp-directory) to learn how to upload a file from `/tmp` in an HTTP request.

## Downloading a file, uploading it in another `multipart/form-data` request

```python
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
import os

def handler(pd: "pipedream"):
  download_url = "https://example.com"
  upload_url = "http://httpbin.org/post"
  file_path = "/tmp/index.html"
  content_type = "text/html"

  # DOWNLOAD
  with requests.get(download_url, stream=True) as response:
      response.raise_for_status()
      with open(file_path, "wb") as file:
          for chunk in response.iter_content(chunk_size=8192):
              file.write(chunk)

  # UPLOAD
  multipart_data = MultipartEncoder(fields={
    'file': (os.path.basename(file_path), open(file_path, 'rb'), content_type)
  })
  response = requests.post(
    upload_url,
    data=multipart_data,
    headers={'Content-Type': multipart_data.content_type}
  )
```

## `/tmp` limitations

The `/tmp` directory can store up to {{$site.themeConfig.TMP_SIZE_LIMIT}} of storage. Also the storage may be wiped or may not exist between workflow executions.

To avoid errors, assume that the `/tmp` directory is empty between workflow runs. Please refer to the [disk limits](/limits/#disk) for details.

::: warning Are File Stores helpers available for Python to download, upload and manage files?

At this time no, only Node.js includes a helper to interact with the [File Store](/projects/file-stores/) programmatically within workflows.

:::
