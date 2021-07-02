# Working with the filesystem in Node.js

You'll commonly need to work with files in a workflow, for example: downloading content from some service to upload to another. This doc explains how to work with files in Pipedream workflows and provides some sample code for common operations. 

[[toc]]

## The `/tmp` directory

Within a workflow, you have full read-write access to the `/tmp` directory. You have `512 MB` of available space in `/tmp` to save any file.

**Data in `/tmp` is cleared after your workflow runs. Subsequent runs of a workflow will not have access to data saved in previous executions.** For high-volume workflows, data _may_ get retained across workflow executions, but you should never expect to have access to these files outside of the current workflow run.

## Writing a file to `/tmp`

Use the [`fs` module](https://nodejs.org/api/fs.html) to write data to `/tmp`:

```javascript
const fs = require("fs");

fs.writeFileSync(`/tmp/myfile`, Buffer.from("hello, world"));
```

## Listing files in `/tmp`

This code sample uses [step exports](/workflows/steps/#step-exports) to return a list of the files saved in `/tmp` that you can use in future steps of your workflow:

```javascript
const fs = require("fs");

this.tmpFiles = fs.readdirSync("/tmp");
```

## Reading a file from `/tmp`

This code sample uses [step exports](/workflows/steps/#step-exports) to return the contents of a test file saved in `/tmp`, returned as a string ([`fs.readFileSync` returns a `Buffer`](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options))

```javascript
const fs = require("fs");

this.fileData = fs.readFileSync(`/tmp/myfile`).toString();
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
