# Go

**Anything you can do in Go, you can do in a Pipedream Workflow**. You can use any of [Go packages available](https://pkg.go.dev/) with a simple `import` no `go get` needed. 

Pipedream supports [Go v{{$site.themeConfig.GO_LANG_VERSION}}](https://go.dev) in workflows.

::: warning
Go steps are available in a limited alpha release.

You can still run arbitrary Go code, including [sharing data between steps](/code/go/#sharing-data-between-steps) as well as [accessing environment variables](/code/go/#using-environment-variables).

However, you can't connect accounts, return HTTP responses, or take advantage of other features available in the [Node.js](/code/nodejs/) environment at this time. If you have any questions please [contact support](https://pipedream.com/support).
:::


## Adding a Go code step

1. Click the + icon to add a new step
2. Click "Custom Code"
3. In the new step, select the `golang` language runtime in language dropdown

## Logging and debugging

You can use `fmt.Println` at any time to log information as the script is running.

The output for the `fmt.Println` **Logs** will appear in the `Results` section just beneath the code editor.

:::tip
Don't forget to import the `fmt` package in order to run `fmt.Println`.

```go{3}
  package main

  import "fmt"

  func main() {
    fmt.Println("Hello World!")
  }
```
:::

## Using third party packages

You can use any packages from [Go package registry](https://pkg.go.dev). This includes popular choices such as:

* [`net/http` for making HTTP requests](https://pkg.go.dev/net/http#pkg-overview/)
* [`encoding/json` for encoding and decoding JSON](https://pkg.go.dev/encoding/json)
* [`database/sql` for reading and writing to SQL databases](https://pkg.go.dev/database/sql@go1.17.6)

To use a Go package, just `import` it in your step's code:

```go
import "net/http"
```

And that's it.


### Sending files

You can send files stored in the `/tmp` directory in an HTTP request:

```go

package main

import (
  "os"
  "log"
  "mime/multipart"
  "bytes"
  "io"
  "net/http"
)

func main() {
  // Instantiate a new HTTP client, body and form writer
  client := http.Client{}
  body := &bytes.Buffer{}
  writer := multipart.NewWriter(body)

  // Create an empty file to start
  fw, _:= writer.CreateFormFile("file", "go-logo.svg")


  // Retrieve a previously saved file from workflow storage
  file, _  := os.Open("/tmp/go-logo.svg")

  // Close multipart form writer
  writer.Close()

  _, _ = io.Copy(fw, file)

  // Send the POST request
  req, _:= http.NewRequest("POST", "https://postman-echo.com/post", bytes.NewReader(body.Bytes()))

  req.Header.Set("Content-Type", writer.FormDataContentType())
  _, err := client.Do(req)
  if err != nil {
    log.Fatalln(err)
  }
}
```

## Sharing data between steps

A step can accept data from other steps in the same workflow, or pass data downstream to others.

This makes your steps even more powerful, you can compose new workflows and reuse steps.

### Using data from another step

Data from the initial workflow trigger and other steps are available in the `pipedream-go` package.

In this example, we'll pretend this data is coming into our HTTP trigger via POST request.

```json
{
  "id": 1,
  "name": "Bulbasaur",
  "type": "plant"
}
```

You can access this data in the `Steps` variable from the `pd` package. Specifically, this data from the POST request into our workflow is available in the `trigger` map. 

```go
package main

import (
	"fmt"
	"github.com/PipedreamHQ/pipedream-go"
)

func main() {
	// Access previous step data using pd.Steps
	fmt.Println(pd.Steps["trigger"])
}
```

### Sending data downstream to other steps

To share data for future steps to use, call the Export function from pd package:

```go
package main

import (
	"encoding/json"
	"github.com/PipedreamHQ/pipedream-go"
	"io/ioutil"
	"net/http"
)

func main() {
  // Use a GET request to look up the latest data on Charizard
	resp, _ := http.Get("https://pokeapi.co/api/v2/pokemon/charizard")
	body, _ := ioutil.ReadAll(resp.Body)

  // Unmarshal the JSON into a struct
	var data map[string]interface{}
	json.Unmarshal(body, &data)

  // Expose the pokemon data downstream to others steps in the "pokemon" key from this step
	pd.Export("pokemon", data)
}
```

Now this `pokemon` data is accessible to downstream steps within `pd.Steps["code"]["pokemon"]`

::: warning
Not all data types can be stored in the `Steps` data shared between workflow steps.

For the best experience, we recommend only [exporting structs that can be marshalled into JSON](https://go.dev/blog/json).
:::

## Using environment variables

You can leverage any [environment variables defined in your Pipedream account](/environment-variables/#environment-variables) in a Go step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.

To access them, use the `os` package.

```go
package main

import (
  "log"
  "os"
)

func main() {
  log.PrintLn(os.Getenv('TWITTER_API_KEY'))
}
```

### Using API key authentication

If a particular service requires you to use an API key, you can pass it via the HTTP request.

This proves your identity to the service so you can interact with it:

```go
package main

import (
  "os"
  "bytes"
  "encoding/json"
  "io/ioutil"
  "log"
  "net/http"
  "fmt"
)

func main() {
  // Access the Twitter API key from the environment 
  const apiKey := os.Getenv('TWITTER_API_KEY'))

  // JSON encode our payload
  payload, _ := json.Marshal(map[string]string{
    "name":  "Bulbasaur",
  })
  payloadBuf:= bytes.NewBuffer(payload)

  // Send the POST request
  req, err := http.NewRequest("POST", "https://api.twitter.com/2/users/@pipedream/mentions'", payloadBuf)
   
  // Build the headers in order to authenticate properly
  req.Header = http.Header{
    "Content-Type": []string{"application/json"},
    "Authorization": []string{fmt.Sprintf("Bearer %s", apiKey)},
  }

  client := http.Client{}
  resp, err := client.Do(req)
  
  if err != nil {
    log.Fatalln(err)
  }
  // Don't forget to close the request after the function is finished
  defer resp.Body.Close()

  // Read the response body
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    log.Fatalln(err)
  }
  // Convert the body into a string
  sb := string(body)
  // Log the body to our Workflow Results
  log.Println(sb)
}
```

## Handling errors

You may need to exit a workflow early, use the `os.Exit` to exit the `main` function with a specific error code.

```go
package main

import (
  "fmt"
  "os"
)

func main() {
  os.Exit(1)
  fmt.Println("This message will not be logged.")
}

```

The step will quit at the time `os.Exit` is called. In this example, the exit code `1` will appear in the **Results** of the step.


## File storage

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

### Reading a file from /tmp

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

### `/tmp` limitations

The `/tmp` directory can store up to {{$site.themeConfig.TMP_SIZE_LIMIT}} of storage. Also the storage may be wiped or may not exist between workflow executions.

To avoid errors, assume that the `/tmp` directory is empty between workflow runs.
