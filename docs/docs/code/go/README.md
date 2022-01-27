# Go

**Anything you can do in Go can be done in a Pipedream Workflow**. This includes using any of the [Go packages available](https://pkg.go.dev/) in your Go powered workflows. 

Pipedream supports [Go v{{$site.themeConfig.GO_LANG_VERSION}}](https://go.dev) in workflows.

::: warning
Go steps are available in a limited alpha release.

You can still run arbitrary Go code, including [sharing data between steps](/code/go/#sharing-data-between-steps) as well as [accessing environment variables](/code/go/#using-environment-variables).

However, features available in [Node.js steps](/code/nodejs) like `$.respond`, `$.end`, and `$.auth` are not yet available in bash. If you have any questions please [contact support](https://pipedream.com/support).
:::


## Adding a Go code step

1. Click the + icon to add a new step
2. Click "Custom Code"
3. In the new step, select the `golang` language runtime in language dropdown

## Logging and debugging

You can use `fmt.Println` at any time in a Go code step to log information as the script is running.

The output for the `fmt.Println` **logs** will appear in the `Results` section just beneath the code editor.

:::tip
Don't forget to import the `fmt` package in order to run `fmt.Println`.

```go{3}
  package main

  import "fmt"

  func main() {
    fmt.Println('Hello World!')
  }
```
:::

## Using third party packages

You can use any packages from [Go package registry](https://pkg.go.dev) in your Pipedream workflows. This includes popular choices such as:

* [`net/http` for making HTTP requests](https://pkg.go.dev/net/http#pkg-overview/)
* [`encoding/json` for encoding and decoding JSON](https://pkg.go.dev/encoding/json)
* [`database/sql` for reading and writing to SQL databases](https://pkg.go.dev/database/sql@go1.17.6)

To use a Go package, just include it in your step's code:

```go
import "net/http"
```

And that's it.

## Making an HTTP request

We recommend using the `http` HTTP client package included in the Go Standard Library for making HTTP requests.

### Making a `GET` request

GET requests typically are for retrieving data from an API. Below is an example.

```go
package main

import (
  "net/http" // HTTP client
  "io/ioutil" // Reads the body of the response
  "log" // Logger
)

func main() {
  resp, err := http.Get("https://swapi.dev/api/people/1")

  if err != nil {
    log.Fatalln(err)
  }
  defer resp.Body.Close()

  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    log.Fatalln(err)
  }

  // The response status code is logged in your Pipedream step results:
  log.Println(resp.Status)

  // The response is logged in your Pipedream step results:
  sb := string(body)
  log.Println(sb) 
}
```

### Making a POST request

```go
package main

import (
   "bytes"
   "encoding/json"
   "io/ioutil"
   "log"
   "net/http"
)

func main() {
  // JSON encode our payload
   payload, _ := json.Marshal(map[string]string{
      "name":  "Bulbasaur",
   })
   payloadBuf:= bytes.NewBuffer(payload)

  // Send the POST request
   resp, err := http.Post("https://postman-echo.com/post", "application/json", payloadBuf)

   if err != nil {
      log.Fatalln(err)
   }
   defer resp.Body.Close()

  //Read the response body
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

### Sending files

You can also send files within a step.

An example of sending a previously stored file in the workflow's `/tmp` directory: 

```go
package main

import (
  "os"
  "log"
  "mime/multipart"
  "bytes"
  "io"
  "mime/multipart"
  "net/http"
  "os"
)

func main() {
  // Instantiate a new HTTP client, body and form writer
  client := http.Client{}
  body := &bytes.Buffer{}
  writer := multipart.NewWriter(body)

  // Create an empty file to start
  fw, err = writer.CreateFormFile("file", "go-logo.svg")
  if err != nil {
    log.Fatalln(e)
  }

  // Retrieve a previously saved file from workflow storage
  file, err := os.Open("/tmp/go-logo.svg")
  if err != nil {
    log.Fatalln(e)
  }

  // Close multipart form writer
  writer.Close()

  _, err = io.Copy(fw, file)

  // Send the POST request
  req, err := http.NewRequest("POST", "https://postman-echo.com/post", bytes.NewReader(body.Bytes()))
  if e != nil {
    log.Fatalln(e)
  }

  req.Header.Set("Content-Type", writer.FormDataContentType())
  rsp, err := client.Do(req)
  if e != nil {
    log.Fatalln(e)
  }
}
```

## Sharing data between steps

A step can accept data from other steps in the same workflow, or pass data downstream to others.

This makes your steps even more powerful, you can compose new workflows and reuse steps.

### Using data from another step

In Go steps, data from the initial workflow trigger and other steps are available in the `pipedream-go` package.

In this example, we'll pretend this data is coming into our HTTP trigger via POST request.

```json
{
  "id": 1,
  "name": "Bulbasaur",
  "type": "plant"
}
```

In our Go step, we can access this data in the `Steps` variable from the `pd` package. Specifically, this data from the POST request into our workflow is available in the `trigger` dictionary item. 

```go
package main

import (
	"fmt"
	"github.com/PipedreamHQ/pipedream-go"
)

func main() {
	// Access previous step data using pd.Steps
	fmt.Println(pd.Steps)
}
```

### Sending data downstream to other steps

To share data created, retrieved, transformed or manipulated by a step to others downstream call the `Export` function from `pd` package.

An example speaks a thousand words, so here's one passing data from an API to the bash step.

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

Now this `pokemon` data is accessible to downstream steps within `pd.Steps.code.pokemon`

::: warning
Not all data types can be stored in the `Steps` data shared between workflow steps.

For the best experience, we recommend only [exporting structs that can be marshalled into JSON](https://go.dev/blog/json).

[Read more details on step limitations here.](/workflows/steps/#limitations-on-step-exports)
:::

## Using environment variables

You can leverage any [environment variables defined in your Pipedream account](/environment-variables/#environment-variables) in a Python step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.

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

Or an even more useful example, using the stored environment variable to make an authenticated API request.

### Using API key authentication

If an particular service requires you to use an API key, you can pass it via the headers of the request.

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

You may need to exit a workflow early. In a Go step, just a `return` from the `main` function.

Optionally, you may want to return an `error` for logging.


```go
package main

import (
  "errors"
  "fmt"
)

func main() (string, error) {
  return "", errors.New("Uh oh, something unexpected happed. Exiting early.")
}

```

The returned error from your Go code will appear in the **logs** area of the results.

## File storage

You can also store and read files with Python steps. This means you can upload photos, retrieve datasets, accept files from an HTTP request and more.

The `/tmp` directory is accessible from your workflow steps for saving and retrieving files.

You have full access to read and write both files in `/tmp`. 

### Writing a file to /tmp

```go
package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
  "log"
)

func main() {
  // Define where the file is and where to save it
	fileUrl := "https://golangcode.com/go-logo.svg"
  filePath := "/tmp/logo.svg"
  
	// Download the file
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
  // Don't forget to the close the HTTP connection at the end of the function
	defer resp.Body.Close()

	// Create the empty file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
  // Don't forget to close close the file
	defer out.Close()

	// Write the file data to file
	_, err = io.Copy(out, resp.Body)
	return err
}
```

Now `/tmp/go-logo.svg` holds the official Go logo.

### Reading a file from /tmp

You can also open files you have previously stored in the `/tmp` directory. Let's open the `python-logo.png` file.

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

The `/tmp` directory can store up to 512 megabytes of storage. Also the storage may be wiped or may not exist between workflow executions.

To avoid errors, assume that the `/tmp` directory is empty between workflow runs.
