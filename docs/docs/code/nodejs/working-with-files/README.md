# Working with the filesystem in Node.js

You'll commonly need to work with files in a workflow, for example: downloading content from some service to upload to another. This doc explains how to work with files in Pipedream workflows and provides some sample code for common operations.

[[toc]]

## The `/tmp` directory

Within a workflow, you have full read-write access to the `/tmp` directory. You have `512 MB` of available space in `/tmp` to save any file.

## Managing `/tmp` across workflow runs

The `/tmp` directory is stored on the virtual machine that runs your workflow. We call this the execution environment ("EE"). More than one EE may be created to handle high-volume workflows. And EEs can be destroyed at any time (for example, after about 10 minutes of receiving no events). This means that you should not expect to have access to files across invocations. At the same time, files _may_ remain, so you should clean them up to make sure that doesn't affect your workflow. **Use [the `tmp-promise` package](https://github.com/benjamingr/tmp-promise) to cleanup files after use, or [delete the files manually](#delete-a-file).**

## Writing a file to `/tmp`

Use the [`fs` module](https://nodejs.org/api/fs.html) to write data to `/tmp`:

```javascript
import fs from "fs"
import { file } from 'tmp-promise'

defineComponent({
  async run({ steps, $ }) {
    const { path, cleanup } = await file();
    await fs.promises.appendFile(path, Buffer.from("hello, world"))
    await cleanup();
  }
});
```

## Listing files in `/tmp`

Return a list of the files saved in `/tmp`:

```javascript
import fs from "fs";

defineComponent({
  async run({ steps, $ }) {
    return fs.readdirSync("/tmp");
  }
});
```

## Reading a file from `/tmp`

This example uses [step exports](/workflows/steps/#step-exports) to return the contents of a test file saved in `/tmp`, returned as a string ([`fs.readFileSync` returns a `Buffer`](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options)):

```javascript
import fs from "fs";

defineComponent({
  async run({ steps, $ }) {
    const files = await fs.promises.readFile('/tmp/your-file');
    this.fileData = files.toString()
  }
});
```

## Delete a file

```javascript
import fs from "fs";

defineComponent({
  async run({ steps, $ }) {
    return await fs.promises.unlink('/tmp/your-file');
  }
});
```

## Download a file to `/tmp`

[See this example](/workflows/steps/code/nodejs/http-requests/#download-a-file-to-the-tmp-directory) to learn how to download a file to `/tmp`.

## Upload a file from `/tmp`

[See this example](/workflows/steps/code/nodejs/http-requests/#upload-a-file-from-the-tmp-directory) to learn how to upload a file from `/tmp` in an HTTP request.

## Download a file, uploading it in another `multipart/form-data` request

[This workflow](https://pipedream.com/@dylburger/download-file-then-upload-file-via-multipart-form-data-request-p_QPCx7p/edit) provides an example of how to download a file at a specified **Download URL**, uploading that file to an **Upload URL** as form data.

## Download email attachments to `/tmp`, upload to Amazon S3

[This workflow](https://pipedream.com/@dylan/upload-email-attachments-to-s3-p_V9CGAQ/edit) is triggered by incoming emails. When copied, you'll get a workflow-specific email address you can send any email to. This workflow takes any attachments included with inbound emails, saves them to `/tmp`, and uploads them to Amazon S3.

You should also be aware of the [inbound payload limits](/limits/#email-triggers) associated with the email trigger.
