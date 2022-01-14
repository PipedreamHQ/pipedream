# Python

Pipedream supports [Python v{{$site.themeConfig.PYTHON_VERSION}}](https://www.python.org) in workflows.

## Adding a Python code step

1. Click the + icon to add a new step
2. Click "Custom Code"
3. In the new step, use the language runtime 

## Making an HTTP request

We recommend using the popular `requests` package available in Python.

No need to run `pip install`, just `import requests` at the top of your step's code and it's available for your code to use.

### Making a GET request

```python
import requests

requests.get(url)

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

headers { 'Authorization': 'Bearer}
requests.get(url, headers=headers)

print(r.text)

```

```note
Not all APIs use a `Authorization: Bearer <api key>` header format.

Refer to the documentation of the API you're working with for their specific format.
```

### Making a POST request

```python
import requests

data = {}

requests.post(url, data)

# to see the response in your Pipedream step logs:
print(r.text)

# to see the response status code in your Pipedream step logs:
print(r.status)
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

## Using 3rd party packages

You can use any packages from PyPi in your Pipedream workflows. This includes popular choices such as:

* `requests` for making HTTP requests
* `sqlalchemy` for retrieving or inserting data in a SQL database
* `pandas` for working with complex datasets

To use a PyPi package, just include it in your step's code:

`import requests`

And that's it.

No need to update a `requirements.txt` or specify elsewhere in your workflow of which packages you need. Pipedream will automatically install the dependency for you.






