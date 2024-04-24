# File Stores Node.js Reference

The File Stores Node.js helper allows you to manage files within Code Steps and Action components.

[[toc]]

## `$.files`

The `$.files` helper is the main module to interact with the Project's File Store. It can instatiate new files, open files from descriptors and list the contents of the File Store.

### `$.files.open(path)`

*Sync.* Opens a file from the relative `path`. If the file doesn't exist, a new empty file is created.

### `$.files.openDescriptor(fileDescriptor)`

*Sync.* Creates a new `File` from the JSON friendly descriptor of a file. Useful for recreating a `File` from a step export.

For example, export a `File` as a step export which will render the `File` as JSON:

```javascript
// create_file
// Creates a new Project File and uploads an image to it
export default defineComponent({
  async run({ steps, $ }) {
    // create the new file and upload the contents to it from a URL
    const file = await $.files.open("imgur.png").fromUrl("https://i.imgur.com/TVIPgNq.png")
    // return the file as a step export
    return file
  },
}
```

Then in a downstream step recreate the `File` instance from the step export friendly _descriptor_:

```javascript
// download_file
// Opens a file downloaded from a previous step, and saves it.
export default defineComponent({
  async run({ steps, $ }) {
    // Convert the the descriptor of the file back into a File instance
    const file = $.files.openDescriptor(steps.create_file.$return_value)
    // Download the file to the local /tmp directory
    await $.file.toFile('/tmp/example.png')
    console.log("File downloaded to /tmp")
  },
})

```

### `$.files.dir(?path)`

*Sync.* Lists the files & directories at the given `path`. By default it will list the files at the root directory.

Here's an example of how to iterate over the files in the root directory and open them as `File` instances:

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // list all contents of the root File Stores directory in this project
    const nodes = $.files.dir();
    let files = [];

    for await(const node of nodes) {
      // if this is a file, let's open it
      if(node.isFile()) {
        files.push(await $.files.open(node.path))
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

This class describes an instance of a single file within a File Store.

When using `$.files.open` or `$.files.openDescriptor`, you'll create a new instance of a `File` with helper methods that give you more flexibility to perform programatic actions with the file.

### `File.toUrl()`

*Async.* The pre-signed GET URL to retrieve the file.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Retrieve the pre-signed GET URL for logo.png 
    const url = await $.files.open('logo.png').toUrl()

    return url
  },
})

```

:::tip Pre-signed GET URLs are short lived.

The `File.toUrl()` will expire after 30 minutes.

:::

### `File.toFile(path)`

*Async.* Downloads the file to the local path in the current workflow. If the file doesn't exist, a new one will be created at the path specified.

:::tip Only `/tmp` is writable in workflow environments

Only the `/tmp` directory is writable in your workflow's exection environment. So you must download your file to the `/tmp` directory. 

:::

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Download the file in the File Store to the workflow's /tmp/ directory
    await $.files.open('logo.png').toFile("/tmp/logo.png")
  },
})

```

### `File.toBuffer()`

*Async.* Downloads the file as a Buffer to create readable or writeable streams.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // opens a file at the path "hello.txt" and downloads it as a Buffer
    const buffer = await $.files.open('hello.txt').toBuffer()
    // Logs the contents of the Buffer as a string
    console.log(buffer.toString())
  },
})
```

### `File.fromFile(localFilePath, ?contentType)`

*Async.* Uploads a file from the file at the `/tmp` local path. For example, if `localFilePath` is given `/tmp/recording.mp3`, it will upload that file to the current File Store File instance.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Upload a file to the File Store from the local /tmp/ directory
    const file = await $.files.open('recording.mp3').fromFile('/tmp/recording.mp3')

    // retrieve the short lived public URL to the file
    const publicUrl = await file.toUrl();
    console.log(publicUrl)
  },
})
```

### `File.fromUrl(url)`

*Async.* Accepts a `url` to read from. 

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Upload a file to the File Store by a URL
    const file = await $.files.open('pipedream.png').fromUrl('https://res.cloudinary.com/pipedreamin/image/upload/t_logo48x48/v1597038956/docs/HzP2Yhq8_400x400_1_sqhs70.jpg')

    console.log(file.url)
  },
})
```

### `File.createWriteStream(?contentType, ?contentLength)`

*Async.* Creates a write stream to populate the file with.

:::tip Pass the content length if possible

The `contentLength` argument is optional, however we do recommend passing it. Otherwise the entire file will need to be written to the local `/tmp` before it can be uploaded to the File store.

:::

```javascript
import { pipeline } from 'stream/promises';
import got from 'got'

export default defineComponent({
  async run({ steps, $ }) {
    const writeStream = await $.files.open('logo.png').createWriteStream("image/png", 2153)

    const readStream = got.stream('https://pdrm.co/logo')

    await pipeline(readStream, writeStream);
  },
})
```

### `File.fromReadableStream(?contentType, ?contentLength)`

*Async.* Populates a file's contents from the `ReadableStream`.

:::tip Pass the content length if possible

The `contentLength` argument is optional, however we do recommend passing it. Otherwise the entire file will need to be written to the local `/tmp` before it can be uploaded to the File store.

:::

```javascript
import got from 'got'

export default defineComponent({
  async run({ steps, $ }) {
    // Start a new read stream
    const readStream = got.stream('https://pdrm.co/logo')

    // Populate the file's content from the read stream
    await $.files.open("logo.png").fromReadableStream(readStream, "image/png", 2153)
  },
})
```

### `File.delete()`

*Async.* Deletes the Project File.

```javascript
export default defineComponent({
  async run({ steps, $ }) {
    // Open the Project File and delete it
    const file = await $.files.open('example.png').delete()

    console.log('File deleted.')
  },
})
```

:::danger Deleting files is irreversible

It's not possible to restore deleted files. Please take care when deleting files.

:::
