# Python

**Anything you can do in Python can be done in a Pipedream workflow**. This includes using any of the [350,000+ packages available on PyPI](https://pypi.org/).

Pipedream supports [Python v{{$site.themeConfig.PYTHON_VERSION}}](https://www.python.org) in workflows.

::: warning
Python steps are in **beta**. There might be changes while we prepare it for a full release.

If you have any feedback on the Python runtime, please let us know in [our community](https://pipedream.com/support).
:::

## Adding a Python code step

1. Click the + icon to add a new step
2. Click **Custom Code**
3. In the new step, select the `python` language runtime in language dropdown

## Python Code Step Structure

A new Python Code step will have the following structure:

```python
# The pipedream package includes helpers to use exported data from other steps, as well as export data from this step
from pipedream.script_helpers import (steps, export)

# Export a variable from this step named "message" containing the string "Hello, World!"
export("message", "Hello, World!")

```

You can also perform more complex operations, including [leveraging your connected accounts to make authenticated API requests](/code/python/auth/), [accessing Data Stores](/code/python/using-data-stores/) and [installing PyPI packages](/code/python/#using-third-party-packages).

- [Install PyPI Packages](/code/python/#using-third-party-packages)
- [Import data exported from other steps](/code/python/#using-data-from-another-step)
- [Export data to downstream steps](/code/python/#sending-data-downstream-to-other-steps)
- [Retrieve data from a data store](/code/python/using-data-stores/#retrieving-data)
- [Store data into a data store](/code/python/using-data-stores/#saving-data)
- [Access API credentials from connected accounts](/code/python/auth/)

## Logging and debugging

You can use `print` at any time in a Python code step to log information as the script is running.

The output for the `print` **logs** will appear in the `Results` section just beneath the code editor.

<div>
<img alt="Python print log output in the results" src="./images/print-logs.png">
</div>

## Using third party packages

<VideoPlayer src="https://www.youtube.com/embed/VKW5D6PYq-Y" title="Importing PyPi Packages into Python Code Steps" />

You can use any packages from [PyPI](https://pypi.org) in your Pipedream workflows. This includes popular choices such as:

- [`requests` for making HTTP requests](https://pypi.org/project/requests/)
- [`sqlalchemy`for retrieving or inserting data in a SQL database](https://pypi.org/project/sqlalchemy/)
- [`pandas` for working with complex datasets](https://pypi.org/project/pandas/)

To use a PyPI package, just include it in your step's code:

```python
import requests
```

And that's it.

No need to update a `requirements.txt` or specify elsewhere in your workflow of which packages you need. Pipedream will automatically install the dependency for you.

### If your package's `import` name differs from its PyPI package name

Pipedream's package installation uses [the `pipreqs` package](https://github.com/bndr/pipreqs) to detect package imports and install the associated package for you. Some packages, like [`python-telegram-bot`](https://python-telegram-bot.org/), use an `import` name that differs from their PyPI name:

```bash
pip install python-telegram-bot
```

vs.

```python
import telegram
```

Use the built in [magic comment system to resolve these mismatches](/code/python/import-mappings/):

```python
# pipedream add-package python-telegram-bot

import telegram
```

### Pinning package versions

Each time you deploy a workflow with Python code, Pipedream downloads the PyPi packages you `import` in your step. **By default, Pipedream deploys the latest version of the PyPi package each time you deploy a change**.

There are many cases where you may want to specify the version of the packages you're using. If you'd like to use a _specific_ version of a package in a workflow, you can add that version in a [magic comment](/code/python/import-mappings/), for example:

```python
# pipedream add-package pandas==2.0.0
import pandas
```

::: warning
Currently, you cannot use different versions of the same package in different steps in a workflow.
:::

## Making an HTTP request

We recommend using the popular `requests` HTTP client package available in Python to send HTTP requests.

No need to run `pip install`, just `import requests` at the top of your step's code and it's available for your code to use.

### Making a `GET` request

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

### Making a POST request

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

### Sending files

You can also send files within a step.

An example of sending a previously stored file in the workflow's `/tmp` directory:

```python
import requests

# Retrieving a previously saved file from workflow storage
files = {'image': open('/tmp/python-logo.png', 'rb')}

r = requests.post(url='https://api.imgur.com/3/image', files=files)
```

## Returning HTTP responses

You can return HTTP responses from [HTTP-triggered workflows](/workflows/steps/triggers/#http) using the `pd.respond()` method:

```python
def handler(pd: 'pipedream'):
    pd.respond({
        'status': 200,
        'body': {
            'message': 'Everything is ok'
        }
    })
```

Please note to always include at least the `body` and `status` keys in your `pd.respond` argument. The `body` must also be a JSON serializable object or dictionary.

:::warning

Unlike the [Node.js equivalent](https://pipedream.com/docs/workflows/steps/triggers/#http-responses), the Python `pd.respond` helper does not yet support responding with Streams.

:::

:::tip
_Don't forget_ to [configure your workflow's HTTP trigger to allow a custom response](/workflows/steps/triggers/#http-responses). Otherwise your workflow will return the default response.
:::

## Sharing data between steps

A step can accept data from other steps in the same workflow, or pass data downstream to others.

### Using data from another step

In Python steps, data from the initial workflow trigger and other steps are available in the `pd.steps` object.

In this example, we'll pretend this data is coming into our workflow's HTTP trigger via POST request.

```json
// POST <our-workflows-endpoint>.m.pipedream.net
{
  "id": 1,
  "name": "Bulbasaur",
  "type": "plant"
}
```

In our Python step, we can access this data in the `exports` variable from the `pd.steps` object passed into the `handler`. Specifically, this data from the POST request into our workflow is available in the `trigger` dictionary item.

```python
# The pipedream package includes helpers to use exported data from other steps, as well as export data from this step
from pipedream.script_helpers import (steps, export)

# retrieve the data from the HTTP request in the initial workflow trigger
pokemon_name = steps["trigger"]["event"]["name"]
pokemon_type = steps["trigger"]["event"]["type"]

print(f"{pokemon_name} is a {pokemon_type} type Pokemon")
```

### Sending data downstream to other steps

To share data created, retrieved, transformed or manipulated by a step to others downstream call the `pd.export` method:

```python
# This step is named "code" in the workflow
from pipedream.script_helpers import (steps, export)

r = requests.get("https://pokeapi.co/api/v2/pokemon/charizard")
# Store the JSON contents into a variable called "pokemon"
pokemon = r.json()

# Expose the data to other steps in the "pokemon" key from this step
export('pokemon', pokemon)
```

Now this `pokemon` data is accessible to downstream steps within `steps["code"]["pokemon"]`

::: warning
You can only export JSON-serializable data from steps. Things like:

- strings
- numbers
- lists
- dictionaries
  :::

## Using environment variables

You can leverage any [environment variables defined in your Pipedream account](/environment-variables/#environment-variables) in a Python step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.

To access them, use the `os` module.

```python
import os
import requests

token = os.environ['AIRTABLE_API_KEY']

print(token)
```

Or an even more useful example, using the stored environment variable to make an authenticated API request.

### Using API key authentication

If an particular service requires you to use an API key, you can pass it via the headers of the request.

This proves your identity to the service so you can interact with it:

```python
import requests
import os

token = os.environ['AIRTABLE_API_KEY']

url = 'https://api.airtable.com/v0/your-airtable-base/your-table'

headers { 'Authorization': f"Bearer {token}"}
r = requests.get(url, headers=headers)

print(r.text)
```

:::tip
There are 2 different ways of using the `os` module to access your environment variables.

`os.environ['ENV_NAME_HERE']` will raise an error that stops your workflow if that key doesn't exist in your Pipedream account.

Whereas `os.environ.get('ENV_NAME_HERE')` will _not_ throw an error and instead returns an empty string.

If your code relies on the presence of a environment variable, consider using `os.environ['ENV_NAME_HERE']` instead.
:::

## Handling errors

You may need to exit a workflow early. In a Python step, just a `raise` an error to halt a step's execution.

```python
raise NameError('Something happened that should not. Exiting early.')
```

All exceptions from your Python code will appear in the **logs** area of the results.

## Ending a workflow early

Sometimes you want to end your workflow early, or otherwise stop or cancel the execution of a workflow under certain conditions. For example:

- You may want to end your workflow early if you don't receive all the fields you expect in the event data.
- You only want to run your workflow for 5% of all events sent from your source.
- You only want to run your workflow for users in the United States. If you receive a request from outside the U.S., you don't want the rest of the code in your workflow to run.
- You may use the `user_id` contained in the event to look up information in an external API. If you can't find data in the API tied to that user, you don't want to proceed.

**In any code step, calling `pd.flow.exit()` will end the execution of the workflow immediately.** No remaining code in that step, and no code or destination steps below, will run for the current event.

```python
def handler(pd: 'pipedream'):
    return pd.flow.exit()
    print("This code will not run, since pd.flow.exit() was called above it")
```

You can pass any string as an argument to `pd.flow.exit()`:

```python
def handler(pd: 'pipedream'):
    return pd.flow.exit('Exiting early. Goodbye.')
    print("This code will not run, since pd.flow.exit() was called above it")
```

Or exit the workflow early within a conditional:

```python
def handler(pd: 'pipedream'):
    # Flip a coin, running pd.flow.exit() for 50% of events
    if random.randint(0, 100) <= 50:
        return pd.flow.exit()

    print("This code will only run 50% of the time");
```

## File storage

You can also store and read files with Python steps. This means you can upload photos, retrieve datasets, accept files from an HTTP request and more.

The `/tmp` directory is accessible from your workflow steps for saving and retrieving files.

You have full access to read and write both files in `/tmp`.

### Writing a file to /tmp

```python
import requests

# Download the Python logo
r = requests.get('https://www.python.org/static/img/python-logo@2x.png')

# Create a new file python-logo.png in the /tmp/data directory
with open('/tmp/python-logo.png', 'wb') as f:
    # Save the content of the HTTP response into the file
    f.write(r.content)
```

Now `/tmp/python-logo.png` holds the official Python logo.

### Reading a file from /tmp

You can also open files you have previously stored in the `/tmp` directory. Let's open the `python-logo.png` file.

```python
import os

with open('/tmp/python-logo.png') as f:
    # Store the contents of the file into a variable
    file_data = f.read()
```

### Listing files in /tmp

If you need to check what files are currently in `/tmp` you can list them and print the results to the **Logs** section of **Results**:

```python
import os

# Prints the files in the tmp directory
print(os.listdir('/tmp'))
```

:::warning
The `/tmp` directory does not have unlimited storage. Please refer to the [disk limits](/limits/#disk) for details.
:::
