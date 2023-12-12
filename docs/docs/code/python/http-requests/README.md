---
short_description: Make HTTP requests with Python in code steps.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646761145/docs/icons/shrine20210108-1-qsuy1b_bhftb2.svg
---

# Making an HTTP request

We recommend using the popular `requests` HTTP client package available in Python to send HTTP requests.

No need to run `pip install`, just `import requests` at the top of your step's code and it's available for your code to use.

## Making a `GET` request

GET requests typically are for retrieving data from an API. Below is an example.

```python
import requests

url = 'https://swapi.dev/api/people/1'

r = requests.get(url)

# The response is logged in your Pipedream step results:
print(r.text)

# The response status code is logged in your Pipedream step results:
print(r.status)
```

## Making a POST request

```python
import requests

# This a POST request to this URL will echo back whatever data we send to it
url = 'https://postman-echo.com/post'

data = {"name": "Bulbasaur"}

r = requests.post(url, data)

# The response is logged in your Pipedream step results:
print(r.text)

# The response status code is logged in your Pipedream step results:
print(r.status)
```

## Sending files

You can also send files within a step.

An example of sending a previously stored file in the workflow's `/tmp` directory: 

```python
# Retrieving a previously saved file from workflow storage
files = {'image': open('/tmp/python-logo.png', 'rb')}

r = requests.post(url='https://api.imgur.com/3/image', files=files)
```
