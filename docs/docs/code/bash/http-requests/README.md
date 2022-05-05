---
short_description: Make HTTP requests with Bash in code steps.
thumbnail: https://res.cloudinary.com/pipedreamin/image/upload/v1646761145/docs/icons/shrine20210108-1-qsuy1b_bhftb2.svg
---

# Making an HTTP request

`curl` is already preinstalled in Bash steps, we recommend using it for making HTTP requests in your code for sending or requesting data from APIs or webpages.

## Making a `GET` request

You can use `curl` to perform `GET` requests from websites or APIs directly.

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

## Making a `POST` request

`curl` can also make `POST`s requests as well. The `-X` flag allow you to specify the HTTP method you'd like to use for an HTTP request.

The `-d` flag is for passing data in the `POST` request.

```bash
curl --silent -X POST https://postman-echo.com/post -d 'name=Bulbasaur&id=1'

# To store the API response in a variable, interpolate the response into a string and store it in variable
RESPONSE=`curl --silent -X POST https://postman-echo.com/post -d 'name=Bulbasaur&id=1'`

# Now the response is stored as a variable
echo $RESPONSE
```

## Using API key authentication

Some APIs require you to authenticate with a secret API key.

`curl` has an `-h` flag where you can pass your API key as a token.

For example, here's how to retrieve mentions from the Twitter API:

```bash
# Define the "Authorization" header to include your Twitter API key
curl --silent -X POST -h "Authorization: Bearer $(<your api key here>)" https://api.twitter.com/2/users/@pipedream/mentions
```
