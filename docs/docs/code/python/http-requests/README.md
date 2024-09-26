---
short_description: Make HTTP requests with Python in code steps.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646761145/docs/icons/shrine20210108-1-qsuy1b_bhftb2.svg
---

# Making HTTP Requests with Python

HTTP requests are fundamental to working with APIs or other web services. You can make HTTP requests to retrieve data from APIs, fetch HTML from websites, or do pretty much anything your web browser can do.

**Below, we'll review how to make HTTP requests using Python code on Pipedream.**

We recommend using the popular `requests` HTTP client package available in Python to send HTTP requests, but [you can use any PyPi package you'd like on Pipedream](/code/python/#using-third-party-packages).

[[toc]]

## Basic `requests` usage notes

No need to run `pip install`, just `import requests` at the top of your step's code and it's available for your code to use.

To use `requests` on Pipedream, you'll just need to import the `requests` PyPi package:

```python
import requests
```

You make HTTP requests by passing a URL and optional request parameters to one of [Requests' 7 HTTP request methods](https://requests.readthedocs.io/en/latest/api/#main-interface).

**Here's how to make a basic HTTP request on Pipedream:**

```python
r = requests.get('https://swapi.dev/api/films/')
```

The [Response](https://requests.readthedocs.io/en/latest/api/#requests.Response) object `r` contains a lot of information about the response: its content, headers, and more. Typically, you just care about the content, which you can access in the `text` property of the response:

```python
r = requests.get('https://swapi.dev/api/films/')

# HTTP response content is in the text property
r.text
```

Requests automatically decodes the content of the response based on its encoding, `r.encoding`, which is determined based on the HTTP headers.

If you're dealing with JSON data, you can call `r.json()` to decode the content as JSON:

```python
r = requests.get('https://swapi.dev/api/films/')

# The json-encoded content of a response, if any
r.json()
```

If JSON decoding fails, `r.json()` raises an exception.

## Making a `GET` request

GET requests typically are for retrieving data from an API. Below is an example.

```python
import requests

def handler(pd: "pipedream"):
  url = "https://swapi.dev/api/people/1"

  r = requests.get(url)

  # The response is logged in your Pipedream step results:
  print(r.text)

  # The response status code is logged in your Pipedream step results:
  print(r.status_code)
```

## Making a `POST` request

```python
import requests

def handler(pd: "pipedream"):
  # This a POST request to this URL will echo back whatever data we send to it
  url = "https://postman-echo.com/post"

  data = {"name": "Bulbasaur"}

  r = requests.post(url, data=data)

  # The response is logged in your Pipedream step results:
  print(r.text)

  # The response status code is logged in your Pipedream step results:
  print(r.status_code)
```

When you make a `POST` request, pass a dictionary with the data you'd like to send to the `data` argument. Requests automatically form-encodes the data when the request is made.

::: tip

The code example above will NOT set the `Content-Type` header, meaning it will NOT be set to `application/json`.

If you want the header set to `application/json` and don't want to encode the `dict` yourself, you can pass it using the `json` parameter and it will be encoded automatically:

```python
  url = "https://postman-echo.com/post"
  data = {"name": "Bulbasaur"}
  r = requests.post(url, json=data)
```

:::

## Passing query string parameters to a `GET` request

Retrieve fake comment data on a specific post using [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a free mock API service. Here, you fetch data from the `/comments` resource, retrieving data for a specific post by query string parameter: `/comments?postId=1`.

```python
import requests

def handler(pd: "pipedream"):
  url = "https://jsonplaceholder.typicode.com/comments"
  params = {"postId": 1}

  # Make an HTTP GET request using requests
  r = requests.get(url, params=params)

  # Retrieve the content of the response
  data = r.text
```

You should pass query string parameters as a dictionary using the `params` keyword argument, like above. When you do, `requests` automatically [URL-encodes](https://www.w3schools.com/tags/ref_urlencode.ASP) the parameters for you, which you'd otherwise have to do manually.

## Sending a request with HTTP headers

To add HTTP headers to a request, pass a dictionary to the `headers` parameter:

```python
import requests
import json

def handler(pd: "pipedream"):
  url = "https://jsonplaceholder.typicode.com/posts"
  headers = {"Content-Type": "application/json"}
  data = {"name": "Luke"}

  # Make an HTTP POST request using requests
  r = requests.post(url, headers=headers, data=json.dumps(data))
```

## Sending a request with a secret or API key

Most APIs require you authenticate HTTP requests with an API key or other token. **Please review the docs for your service to understand how they accept this data.**

Here's an example showing an API key passed in an HTTP header:

```python
import requests

def handler(pd: "pipedream"):
  url = "https://jsonplaceholder.typicode.com/posts"
  headers = {"X-API-KEY": "123"} # API KEY
  data = {"name": "Luke"}

  # Make an HTTP POST request using requests
  r = requests.post(url, headers=headers, json=data)
```

## Sending files

An example of sending a previously stored file in the workflow's `/tmp` directory:

```python
import requests

def handler(pd: "pipedream"):
  # Retrieving a previously saved file from workflow storage
  files = {"image": open("/tmp/python-logo.png", "rb")}

  r = requests.post(url="https://api.imgur.com/3/image", files=files)
```

## Downloading a file to the `/tmp` directory

This example shows you how to download a file to a file in [the `/tmp` directory](/code/python/working-with-files/). This can be especially helpful for downloading large files: it streams the file to disk, minimizing the memory the workflow uses when downloading the file.

```python
import requests

def handler(pd: "pipedream"):
  # Download the webpage HTML file to /tmp
  with requests.get("https://example.com", stream=True) as response:
      # Check if the request was successful
      response.raise_for_status()

      # Open the new file /tmp/file.html in binary write mode
      with open("/tmp/file.html", "wb") as file:
          for chunk in response.iter_content(chunk_size=8192):
              # Write the chunk to file
              file.write(chunk)
```

## Uploading a file from the `/tmp` directory

This example shows you how to make a `multipart/form-data` request with a file as a form part. You can store and read any files from [the `/tmp` directory](/code/python/working-with-files/#the-tmp-directory).

This can be especially helpful for uploading large files: it streams the file from disk, minimizing the memory the workflow uses when uploading the file.

```python
import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

def handler(pd: "pipedream"):
  m = MultipartEncoder(fields={
    'file': ('filename', open('/tmp/file.pdf', 'rb'), 'application/pdf')
    })

  r = requests.post("https://example.com", data=m,
                  headers={'Content-Type': m.content_type})
```

## IP addresses for HTTP requests made from Pipedream workflows

By default, [HTTP requests made from Pipedream can come from a large range of IP addresses](/privacy-and-security/#hosting-details). **If you need to restrict the IP addresses HTTP requests come from, you can [Use a Pipedream VPC](/workflows/vpc/) to route all outbound HTTP requests through a single IP address.**

## Using an HTTP proxy to proxy requests through another host

By default, HTTP requests made from Pipedream can come from a range of IP addresses. **If you need to make requests from a single IP address, you can route traffic through an HTTP proxy**:

```python
import requests

def handler(pd: "pipedream"):
  user = "USERNAME" # Replace with your HTTP proxy username
  password = "PASSWORD" # Replace with your HTTP proxy password
  host = "10.10.1.10" # Replace with the HTTP proxy URL
  port = 1080 # Replace with the port of the HTTP proxy
  proxies = {
    "https": f"http://{user}:{password}@{host}:{port}",
  }

  r = requests.request("GET", "https://example.com", proxies=proxies)
```

## Paginating API requests

When you fetch data from an API, the API may return records in "pages". For example, if you're trying to fetch a list of 1,000 records, the API might return those in groups of 100 items.

Different APIs paginate data in different ways. You'll need to consult the docs of your API provider to see how they suggest you paginate through records.

## Sending a GraphQL request

Construct a GraphQL query as a string and then using the requests library to send it to the GraphQL server:

```python
import requests

def handler(pd: "pipedream"):
  url = "https://beta.pokeapi.co/graphql/v1beta"

  query = """
query samplePokeAPIquery {
  generations: pokemon_v2_generation {
    name
    pokemon_species: pokemon_v2_pokemonspecies_aggregate {
      aggregate {
        count
      }
    }
  }
}
  """

  r = requests.post(url, json={"query": query})
  return r.json()
```

### Sending an authenticated GraphQL request

Authenticate your connected accounts in Pipedream with GraphQL requests using `pd.inputs[appName]["$auth"]`:

```python
import requests

def handler(pd: "pipedream"):
  url = "https://api.github.com/graphql"
  query = """
query { 
  viewer { 
    login
  }
}
  """
  token = pd.inputs["github"]["$auth"]["oauth_access_token"]
  headers = {"authorization": f"Bearer {token}"}
  r = requests.post(url, json={"query": query}, headers=headers)
  return r.json()
```

Alternatively, you can use Environment Variables as well for simple API key based GraphQL APIs.
