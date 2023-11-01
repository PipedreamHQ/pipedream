---
short_description: Store and read files with Node.js in workflows.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763737/docs/icons/icons8-opened-folder_y60u9l.svg
---

# Working with the filesystem in Node.js

You'll commonly need to work with files in a workflow, for example: downloading content from some service to upload to another. This doc explains how to work with files in Pipedream workflows and provides some sample code for common operations.

[[toc]]

## The `/tmp` directory

Within a workflow, you have full read-write access to the `/tmp` directory. You have {{$site.themeConfig.TMP_SIZE_LIMIT}} of available space in `/tmp` to save any file.

### Managing `/tmp` across workflow runs

The `/tmp` directory is stored on the virtual machine that runs your workflow. We call this the execution environment ("EE"). More than one EE may be created to handle high-volume workflows. And EEs can be destroyed at any time (for example, after about 10 minutes of receiving no events). This means that you should not expect to have access to files across executions. At the same time, files _may_ remain, so you should clean them up to make sure that doesn't affect your workflow. **Use [the `tmp-promise` package](https://github.com/benjamingr/tmp-promise) to cleanup files after use, or [delete the files manually](#delete-a-file).**

### Reading a file from `/tmp`

This example uses [step exports](/workflows/steps/#step-exports) to return the contents of a test file saved in `/tmp` as a string:

```javascript
import fs from "fs";

export default defineComponent({
  async run({ steps, $ }) {
    return (await fs.promises.readFile('/tmp/your-file')).toString()
  }
});
```

### Writing a file to `/tmp`

Use the [`fs` module](https://nodejs.org/api/fs.html) to write data to `/tmp`:

```javascript
import fs from "fs"
import { file } from 'tmp-promise'

export default defineComponent({
  async run({ steps, $ }) {
    const { path, cleanup } = await file();
    await fs.promises.appendFile(path, Buffer.from("hello, world"))
    await cleanup();
  }
});
```

### Listing files in `/tmp`

Return a list of the files saved in `/tmp`:

```javascript
import fs from "fs";

export default defineComponent({
  async run({ steps, $ }) {
    return fs.readdirSync("/tmp");
  }
});
```

### Delete a file

```javascript
import fs from "fs";

export default defineComponent({
  async run({ steps, $ }) {
    return await fs.promises.unlink('/tmp/your-file');
  }
});
```

### Download a file to `/tmp`

[See this example](/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory) to learn how to download a file to `/tmp`.

### Upload a file from `/tmp`

[See this example](/code/nodejs/http-requests/#upload-a-file-from-the-tmp-directory) to learn how to upload a file from `/tmp` in an HTTP request.

### Download a file, uploading it in another `multipart/form-data` request

[This workflow](https://pipedream.com/@dylburger/download-file-then-upload-file-via-multipart-form-data-request-p_QPCx7p/edit) provides an example of how to download a file at a specified **Download URL**, uploading that file to an **Upload URL** as form data.

### Download email attachments to `/tmp`, upload to Amazon S3

[This workflow](https://pipedream.com/@dylan/upload-email-attachments-to-s3-p_V9CGAQ/edit) is triggered by incoming emails. When copied, you'll get a workflow-specific email address you can send any email to. This workflow takes any attachments included with inbound emails, saves them to `/tmp`, and uploads them to Amazon S3.

You should also be aware of the [inbound payload limits](/limits/#email-triggers) associated with the email trigger.


## Project Files

Project Files are a filesystem that is scoped to Project. All workflows within the same Project have access to the Project Files.

You can interact with these files through the Pipedream Dashboard or programmatically through your Project's workflows.

?? Why are we titling these as "Temporary Files"? Just because the URLs are temporary? Seems like "Project Files" is a better description?

### Managing Project Files from the Dashboard



### Uploading Project Files



### Viewing Project Files
@TODO screenshot


### Deleting Project Files

![Deleting a Project File from the Dashboard](https://res.cloudinary.com/pipedreamin/image/upload/v1698855610/docs/docs/Project%20Files/CleanShot_2023-11-01_at_12.19.20_lb4ddt.png)





### Managing Project Files from Workflows

#### Uploading files from workflows

#### Downloading files to workflows

#### Passing files between steps

Files can be passed between steps. Pipedream will automatically serialize the file as a JSON _description_ of the file.

The description of the file includes these properties:

* `path` - The path to the Project File (compatible with `$.files.openPath()`).
* `get_url` - A pre-signed S3 GET URL.
* `put_url` - A pre-signed S3 PUT URL.
* `expires_at_ms` - The Unix timestamp of the expiration date of both pre-signed S3 URLs.
* `type` - a static property. The `type` will always be `"PipedreamProjectFile"`, in order for the `$.files.openDescriptor()` to function properly.

:::tip Files descriptions are compatible with other workflow helpers

Files can also be used with `$.suspend` and `$.delay`.

:::

#### Deleting files from workflows


## `$.files`

### `$.files.openPath(path)`

Async. Opens a file from the relative `path`. If the file doesn't exist, a new empty file is created.

### `$.files.openDescriptor(fileDescriptor)`

Creates a new `File` from the JSON friendly description of a file. Useful for recreating a `File` from a step export.

For example, export a `File` as a step export which will render the `File` as JSON:

```javascript
// create_file
// Creates a new Project File and uploads an image to it
export default defineComponent({
  async run({ steps, $ }) {
    // create the new Project file
    const file = await $.files.openPath("imgur.png")
    // upload the contents to it from a URL
    await file.uploadFromUrl("https://i.imgur.com/TVIPgNq.png")
    // return the file as a step export
    return file
  },
}
```

Then in a downstream step recreate the `File` instance from the step export friendly _description_:

```javascript
// download_file
// Opens a file downloaded from a previous step, and saves it.
export default defineComponent({
  async run({ steps, $ }) {
    // Convert the the description of the file back into a File instance
    const file = $.files.openDescriptor(steps.create_file.$return_value)
    // Download the file to the local /tmp directory
    await $.file.download('/tmp/example.png')
    console.log("File downloaded to /tmp")
  },
})

```

### `$.files.dir(?path)`

Lists the files & directories at the given `path`. By default it will list the files at the root directory.

Here's an example of how to iterate over the files in the root directory and open them as `File` instances:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // list all contents of the root Project Files directory in this project
    const dirs = $.files.dir();
    let files = [];

    for await(const dir of dirs) {
      // if this is a file, let's open it
      if(dir.isFile()) {
        files.push(await $.files.openPath(dir.path))
      }
    }

    return files
  },
})
```

Each iteratee of `$.files.dir()` will contain the following properties:

* `isDirectory()` - `true` if this instance is a directory.
* `isFile()` - `true` if this instance is a file.
* `path` - The path to the file.
* `size` - The size of the file in bytes.
* `modifiedAt` - The last modified at timestamp.

## `File`

When using `$.files.openPath` or `$.files.openDescriptor`, you'll create a new instance of a `File` with helper methods that give you more flexibility to perform programatic actions with the file.

### `File.url`

The pre-signed GET URL to retrieve the file.

:::tip Pre-signed GET URLs are short lived.

The `File.url` will expire after 30 minutes. You can call `File.refresh()` to refresh these URLs if needed.

:::

### `File.downloadFile(path)`

Async. Downloads the file to the local path in the current workflow. If the file doesn't exist, a new one will be created at the path specified.

:::tip Only `/tmp` is writable in workflow environments

Only the `/tmp` directory is writable in your workflow's exection environment. So you must download your file to the `/tmp` directory. 

:::

### `File.downloadAsBuffer()`

Async. Downloads the file as a Buffer to create readable or writeable streams.

### `File.uploadFile(localFilePath, ?contentType)`

Async. Uploads a file from the file at the `

?? Should this be just a `copy` operation?

### `File.uploadFromUrl(url)`

Async. Accepts a `url` to read from. 

?? Is there any way to pass authorization to this to download private files?

### `File.createReadStream()`

### `File.createWriteStream()`

### `File.delete()`

Async. Deletes the Project File.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Open the Project File
    const file = await $.files.openPath('example.png')
    // Delete it
    await file.delete()
    console.log('File deleted.')
  },
})
```

:::danger Deleting files is irreversible

It's not possible to restore deleted files. Please take care when deleting files.

:::

### `File.refresh()`

Async. Refreshes the S3 pre-signed URLs expiration time.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Open the Project File
    const file = await $.files.openPath('example.png')
    // View the current expiration timestamp
    console.log(file.expires_at)
    // Refresh the S3 pre-signed URLs to extend the expiration
    await file.refresh()
    // View the new expiration timestamp
    console.log(file.expires_at)
  },
})
```
