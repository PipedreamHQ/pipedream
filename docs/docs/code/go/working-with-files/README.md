---
short_description: Store and read files with Go in workflows.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646763737/docs/icons/icons8-opened-folder_y60u9l.svg
---

# File storage

You can also store and read files with Go steps. This means you can upload photos, retrieve datasets, accept files from an HTTP request and more.

The `/tmp` directory is accessible from your workflow steps for saving and retrieving files.

You have full access to read and write both files in `/tmp`. 

### Writing a file to `/tmp`

```go
package main

import (
  "io"
  "net/http"
  "os"
  "fmt"
)
func main() {
  // Define where the file is and where to save it
	fileUrl := "https://golangcode.com/go-logo.svg"
  filePath := "/tmp/go-logo.svg"
  
	// Download the file
	resp, err := http.Get(fileUrl)
	if err != nil {
		fmt.Println(err)
	}

  // Don't forget to the close the HTTP connection at the end of the function
	defer resp.Body.Close()

	// Create the empty file
	out, err := os.Create(filePath)
	if err != nil {
		fmt.Println(err)
	}

  // Don't forget to close close the file
	defer out.Close()

	// Write the file data to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		fmt.Println(err)
	}
}
```

Now `/tmp/go-logo.svg` holds the official Go logo.

## Reading a file from /tmp

You can also open files you have previously stored in the `/tmp` directory. Let's open the `go-logo.svg` file.

```go
package main

import (
  "os"
  "log"
)

func main() {
  // Open the file
  data, err := os.ReadFile("/tmp/go-logo.svg")

  if e != nil {
    log.Fatalln(e)
  }

  // Print it's contents to the logs
  log.Println(string(data))
}
```

## `/tmp` limitations

The `/tmp` directory can store up to {{$site.themeConfig.TMP_SIZE_LIMIT}} of storage. Also the storage may be wiped or may not exist between workflow executions.

To avoid errors, assume that the `/tmp` directory is empty between workflow runs. Please refer to the [disk limits](/limits/#disk) for details.
