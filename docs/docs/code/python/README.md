# Writing Python in Code Steps

**Anything you can do in Python can be done in a Pipedream Workflow**. This includes using any of the [350,000+ PyPi packages available](https://pypi.org/) in your Python powered workflows. 

Pipedream supports [Python v{{$site.themeConfig.PYTHON_VERSION}}](https://www.python.org) in workflows.

## Adding a Python code step

1. Click the + icon to add a new step
2. Click "Custom Code"
3. In the new step, use the language runtime
   
## Logging & debugging

You can use `print` at any time in a Python code step to view information as the script is running.

The output for the `print` logs will appear in the `Results` section just beneath the code editor.

<div>
<img alt="Python print log output in the results" src="./images/print-logs.png">
</div>

## Using 3rd party packages

You can use any packages from PyPi in your Pipedream workflows. This includes popular choices such as:

* `requests` for making HTTP requests
* `sqlalchemy` for retrieving or inserting data in a SQL database
* `pandas` for working with complex datasets

To use a PyPi package, just include it in your step's code:

`import requests`

And that's it.

No need to update a `requirements.txt` or specify elsewhere in your workflow of which packages you need. Pipedream will automatically install the dependency for you.

## Making an HTTP request

We recommend using the popular `requests` package available in Python.

No need to run `pip install`, just `import requests` at the top of your step's code and it's available for your code to use.

### Making a GET request

```python
import requests

url = 'https://swapi.dev/api/people/1'

r = requests.get(url)

# to see the response in your Pipedream step logs:
print(r.text)

# to see the response status code in your Pipedream step logs:
print(r.status)
```

### Making a POST request

```python
import requests

data = {}

r = requests.post(url, data)

# to see the response in your Pipedream step logs:
print(r.text)

# to see the response status code in your Pipedream step logs:
print(r.status)
```

### Using API key authentication

If an particular service requires you to use an API key, you can pass it via the headers of the request.

This proves your identity to the service so you can interact with it:

```python
import requests

token = 'replace this with your API key'

headers { 'Authorization': f"Bearer {token}"}
r = requests.get(url, headers=headers)

print(r.text)
```

```note
Not all APIs use a `Authorization: Bearer <api key>` header format.

Refer to the documentation of the API you're working with for their specific authentication format.
```

### Sending files

You can send also files within a step.

An example of sending a previously stored file in the workflow's `/tmp` directory: 

```python
# Retrieving a previously saved file from workflow storage
files = {'image': ('python-logo.png', open('/tmp/python-logo.png', 'rb')}

r = requests.post(url='https://api.imgur.com/3/image', files=files)
```

## Sharing data between steps

You can share data between steps in your workflows. Data can be passed forward to the next steps, and it can be used by other steps downstream.

### Using data from another step

You may need to use data from a prior step in your workflow.

For example, when your trigger step accepts data from an incoming HTTP request you may need to send that data to another API, transform that data or store it somewhere.

In this example, we'll pretend this data is coming into our HTTP trigger.

```json
{
  id: 1,
  name: 'Bulbasaur',
  type: 'plant'
}
```

Every Python step can import the `pipedream.script_helpers` module. This module contains data from other steps in the workflow via `steps` dictionary.

Here's an example of how to get the ID from the Pokemon we recieved in the trigger.

```python
from pipedream.script_helpers import (steps, export)

# retrieve the data points from the HTTP request 
name = steps["trigger"]["event"]["name"]
pokemon_type = steps["trigger"]["event"]["type"]

print(f"{pokemon_name} is a {pokemon_type} type Pokemon")
```

### Sending data downstream to other steps

The trigger steps automatically export their data for other steps to use downstream.

Just pass the data to the `export` module from `pipedream.script_helpers`.

```python
# this step is named "code"
from pipedream.script_helpers import (steps, export)

pokemon = { name: "Pikachu" }

export('pokemon', pokemon)
```

Now this `pokemon` is accessible to downstream steps within `steps.code.pokemon`

## File storage

Not only can you run Python code in workflows, but you can also store files as well. This means you can upload or download photos, retrieve datasets or accept files from an HTTP request and much more.

The `/tmp` directory is accessible from your workflow steps for saving and retrieving files.

You have full access to read & write both files & directories in `/tmp`. 

### Writing a file to /tmp

```python
import requests

# download the Python logo
r = requests.get('https://www.python.org/static/img/python-logo@2x.png')

# create a new file python-logo.png in the /tmp/data directory
with open('/tmp/python-logo.png', 'wb') as f:
  # save the content of the HTTP response into the file
  f.write(r.content)
```

Now `/tmp/python-logo.png` holds the official Python logo.


### Reading a file from /tmp

You can also open files you have previously stored in the `/tmp` directory. Let's open the `python-logo.png` we downloaded in the previous example.

```python
import os

with open('/tmp/python-logo.png') as f:
  read_data = f.read()

```



### Listing files in /tmp

If you need to check what files are currently in `/tmp` you can list them and print the results to the workflow console:

```python
import os

# Prints the files in the tmp directory
print(os.listdir('/tmp'))
```

### `/tmp` limitations

The `/tmp` directory can store up to 512 megabytes of storage. Also the storage may be wiped or may not exist between workflow exections. 

