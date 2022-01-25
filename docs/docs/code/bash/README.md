# Bash

Prefer to write quick scripts in bash? We've got you covered.

You can run any bash in a Pipedream step within your workflows.

::: warning
Bash steps are available in a limited alpha release.

You can still run arbitrary bash scripts, including [sharing data between steps](/code/bash/#sharing-data-between-steps) as well as [accessing environment variables](/code/bash/#using-environment-variables).

However, features available in [Node.js steps](/code/nodejs) like `$.respond`, `$.end`, and `$.auth` are not yet available in bash. If you have any questions please [contact support](https://pipedream.com/support).
:::

## Adding a Bash code step

1. Click the + icon to add a new step
2. Click "Custom Code"
3. In the new step, select the bash runtime in language dropdown

## Logging & debugging

When it comes to debugging bash scripts, `echo` is your friend.

Your `echo` statements will print their output in the workflow step results:

```bash
MESSAGE='Hello world'

# The message will now be available in the "Result > Logs" area in the workflow step
echo $MESSAGE
```

## Available binaries

Bash steps come with many common & useful binaries preinstalled and available in `$PATH` for you to use out of the box. These binaries include but aren't limited to:

* `curl` for making HTTP requests
* `jq` for manipulating and viewing JSON data
* `git` for interacting with remote repositories

Unfortunately it is not possible to install from a package manager like `apt` or `yum`.

If you need a package pre-installed in your bash steps, [just ask us](https://pipedream.com/support).

Otherwise, you can use `/tmp` to download and install from source.

## Making an HTTP request

`curl` is already preinstalled in bash steps, we recommend using it for making HTTP requests in your code for sending or requesting data from APIs or webpages.

### Making a GET request

You can use `curl` to perform GET requests from websites or APIs directly.

```bash
# Get the current weather in San Francisco
WEATHER=`curl --silent https://wttr.in/San\ Francisco\?format=3`

echo $WEATHER
# Produces:
# San Francisco: 🌫  +48°F
```

::: tip
Use the `--silent` flag with `curl` to suppress extra extra diagnostic information that `curl` produces when making requests.

This enables you to only worry about the body of the response so you can visualize it with tools like `echo` or `jq`. 
:::

### Making a POST request

`curl` handles making POSTs requests as well. The `-X` flag allow you to specify the HTTP method you'd like to use for an HTTP request.

The `-d` flag is for passing data in the POST request.

```bash
curl --silent -X POST https://postman-echo.com/post -d 'name=Bulbasaur&id=1'

# to store the API response in a variable, interpolate the response into a string and store it in variable
RESPONSE=`curl --silent -X POST https://postman-echo.com/post -d 'name=Bulbasaur&id=1'`

# now the response is stored as a variable
echo $RESPONSE
```

### Using API key authentication

Some APIs require you to use a secret API key to prove your access.

`curl` has an `-h` flag where you can pass your API key as a token.

Below is an example of searching Twitter for mentions of a specific Twitter handle. Twitter requires a valid API key passed in the header of the request.

```bash
curl --silent -X POST -h "authorization:Bearer $(<your api key here>)" https://api.twitter.com/2/users/@pipedream/mentions
```

## Sharing data between steps

A step can accept data from other steps in the same workflow, or pass data downstream to others.

This makes your steps even more powerful, you can compose new workflows and reuse steps.

### Using data from another step

In bash scripts, data from the initial workflow trigger and other steps are available in the `$PIPEDREAM_STEPS` environment variable.

In this example, we'll pretend this data is coming into our HTTP trigger via a POST request.

```json
{
  "id": 1,
  "name": 'Bulbasaur",
  "type": "plant"
}
```

In our bash script, we can access this data via the `$PIPEDREAM_STEPS` variable. Specifically, this data from the POST request into our workflow is available in the `trigger` object.

```bash
echo $PIPEDREAM_STEPS | jq .trigger.event

# results in { id: 1, name: "Bulbasaur", type: "plant" }
```

::: tip
The period (`.`) in front the `trigger.event` in the example is not a typo. This is to define the starting point for `jq` to start traversing down the JSON in the HTTP response.
:::

### Sending data downstream to other steps

To share data created, retrieved, transformed or manipulated by a step to others downstream, append it to the `$PIPEDREAM_EXPORTS` variable.

An example speaks a thousand words, so here's one passing data from an API to the bash step.

```bash
# Retrieve the data from an API and store it in a variable
DATA=`curl --silent https://pokeapi.co/api/v2/pokemon/charizard`

# Write data to $PIPEDREAM_EXPORTS to share with steps downstream
EXPORT="key:json=${DATA}"
echo $EXPORT >> $PIPEDREAM_EXPORTS
```

::: tip
Don't worry, the special `key` string in the `EXPORT` will automatically reference the current step's name. 

This way you won't have collisions with multiple bash scripts exporting data. Accessing the data is based off of the step's name, no need to edit the `key` string to try and name it something unique.
:::

## Using environment variables

You can leverage any [environment variables defined in your Pipedream account](/environment-variables/#environment-variables) in a bash step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.

To access them, just append the `$` in front of the environment variable name.

```bash
echo $POKEDEX_API_KEY
```

Or an even more useful example, using the stored environment variable to make an authenticated API request.

```bash
curl --silent -X POST -h "authorization:Bearer $TWITTER_API_KEY" https://api.twitter.com/2/users/@pipedream/mentions
```

## Raising exceptions

You may need to stop your step immediately. You can use the normal `exit` function available in bash to quit the step prematurely.

```bash
  echo "Exiting now!" 1>&2
  exit 1
```

This will exit the step and output the error message to `stderr` which will appear in the results of the step in the workflow.

## File storage

If you need to download and store files you can place them in the `/tmp` directory.

### Writing a file to /tmp

For example to download a file to `/tmp` using `curl`

```bash
# Download the current weather in Cleveland in PNG format
curl --silent https://wttr.in/Cleveland.png --output /tmp/weather.png

# output the contents of /tmp to confirm the file is there
ls /tmp
```

### `/tmp` limitations

The `/tmp` directory can store up to 512 megabytes of storage. Also the storage may be wiped or may not exist between workflow executions.

To avoid errors, assume that the `/tmp` directory is empty between workflow runs.
