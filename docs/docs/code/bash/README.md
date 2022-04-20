# Bash

Prefer to write quick scripts in Bash? We've got you covered.

You can run any Bash in a Pipedream step within your workflows.

::: warning
Bash steps are available in a limited alpha release.

You can still run arbitrary Bash scripts, including [sharing data between steps](/code/bash/#sharing-data-between-steps) as well as [accessing environment variables](/code/bash/#using-environment-variables).

However, you can't connect accounts, return HTTP responses, or take advantage of other features available in the [Node.js](/code/nodejs/) environment at this time. If you have any questions, find bugs or have feedback please [contact support](https://pipedream.com/support).
:::

## Adding a Bash code step

1. Click the + icon to add a new step
2. Click **Custom Code**
3. In the new step, select the `bash` runtime in language dropdown

## Logging and debugging

When it comes to debugging Bash scripts, `echo` is your friend.

Your `echo` statements will print their output in the workflow step results:

```bash
MESSAGE='Hello world'

# The message will now be available in the "Result > Logs" area in the workflow step
echo $MESSAGE
```

## Available binaries

Bash steps come with many common and useful binaries preinstalled and available in `$PATH` for you to use out of the box. These binaries include but aren't limited to:

* `curl` for making HTTP requests
* `jq` for manipulating and viewing JSON data
* `git` for interacting with remote repositories

Unfortunately it is not possible to install packages from a package manager like `apt` or `yum`.

If you need a package pre-installed in your Bash steps, [just ask us](https://pipedream.com/support).

Otherwise, you can use the `/tmp` directory to download and install software from source.



## Sharing data between steps

A step can accept data from other steps in the same workflow, or pass data downstream to others.

### Using data from another step

In Bash steps, data from the initial workflow trigger and other steps are available in the `$PIPEDREAM_STEPS` environment variable.

In this example, we'll pretend this data is coming into our HTTP trigger via a POST request.

```json
{
  "id": 1,
  "name": "Bulbasaur",
  "type": "plant"
}
```

In our Bash script, we can access this data via the `$PIPEDREAM_STEPS` file. Specifically, this data from the POST request into our workflow is available in the `trigger` object.

```bash
echo $PIPEDREAM_STEPS | jq .trigger.event

# Results in { id: 1, name: "Bulbasaur", type: "plant" }
```

::: tip
The period (`.`) in front the `trigger.event` in the example is not a typo. This is to define the starting point for `jq` to traverse down the JSON in the HTTP response.
:::

### Sending data downstream to other steps

To share data for future steps to use downstream, append it to the `$PIPEDREAM_EXPORTS` file.

```bash
# Retrieve the data from an API and store it in a variable
DATA=`curl --silent https://pokeapi.co/api/v2/pokemon/charizard`

# Write data to $PIPEDREAM_EXPORTS to share with steps downstream
EXPORT="key:json=${DATA}"
echo $EXPORT >> $PIPEDREAM_EXPORTS
```

::: warning
Not all data types can be stored in the `$PIPEDREAM_EXPORTS` data shared between workflow steps.

You can only export JSON-serializable data from Bash steps.
:::

## Using environment variables

You can leverage any [environment variables defined in your Pipedream account](/environment-variables/#environment-variables) in a bash step. This is useful for keeping your secrets out of code as well as keeping them flexible to swap API keys without having to update each step individually.

To access them, just append the `$` in front of the environment variable name.

```bash
echo $POKEDEX_API_KEY
```

Or an even more useful example, using the stored environment variable to make an authenticated API request.

```bash
curl --silent -X POST -h "Authorization: Bearer $TWITTER_API_KEY" https://api.twitter.com/2/users/@pipedream/mentions
```

## Raising exceptions

You may need to stop your step immediately. You can use the normal `exit` function available in Bash to quit the step prematurely.

```bash
echo "Exiting now!" 1>&2
exit 1
```
:::warning
Using `exit` to quit a Bash step early _won't_ stop the execution of the rest of the workflow.

Exiting a Bash step will only apply that particular step in the workflow.
:::

This will exit the step and output the error message to `stderr` which will appear in the results of the step in the workflow.

## File storage

If you need to download and store files, you can place them in the `/tmp` directory.

### Writing a file to /tmp

For example, to download a file to `/tmp` using `curl`

```bash
# Download the current weather in Cleveland in PNG format
curl --silent https://wttr.in/Cleveland.png --output /tmp/weather.png

# Output the contents of /tmp to confirm the file is there
ls /tmp
```

:::warning
The `/tmp` directory does not have unlimited storage. Please refer to the [disk limits](/limits/#disk) for details.
:::
