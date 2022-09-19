---
short_description: Make HTTP requests with Go in code steps.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646761145/docs/icons/shrine20210108-1-qsuy1b_bhftb2.svg
---

# Making an HTTP request

We recommend using the `http` HTTP client package included in the Go Standard Library for making HTTP requests.

## Making a `GET` request

You'll typically use `GET` requests to retrieve data from an API:

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

## Making a `POST` request

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
