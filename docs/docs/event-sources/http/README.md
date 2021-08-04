# Creating an HTTP source

This tutorial will walk you through how to: 

1. [Install the Pipedream CLI](#install-the-pipedream-cli)
2. [Link your Pipedream account to the CLI](#link-your-pipedream-account-to-the-cli)
3. [Create an HTTP source](#create-an-http-source)
4. [Consume events from your source](#consume-events-from-your-source)

This should take about 5 minutes to complete.

## Install the Pipedream CLI

[See the CLI installation docs](/cli/install/) to learn how to install the CLI for your OS / architecture. 

## Link your Pipedream account to the CLI

If you haven't signed up for a Pipedream account, you can create an account at this step.

Run:

```
pd login
```

This will open up a new window in your default browser. If you're already logged into your Pipedream account in this browser, this will immediately link the CLI to this account, writing your API key for that account to your [`pd` config file](/cli/reference/#cli-config-file).

Otherwise, you'll be directed to login or sign up for a new account.

Once you're done, go back to your shell and you should see confirmation that your account is linked:

```
> pd login
Logged in as dylburger (dylan@pipedream.com)
```

## Create an HTTP source

Run:

```
pd deploy http-new-requests
```

Deploying this source creates an endpoint URL specific your source that you can send any HTTP request to. The CLI will display this endpoint when your source is done deploying. It'll also immediately start listening to the SSE stream tied to your source, displaying new events as they arrive:

```
> pd deploy http-new-requests

Deploying...
Deploy complete.

Source name: http
Endpoint: https://myendpoint.m.pipedream.net

Listening for new events on the SSE stream for this source:

    https://rt.pipedream.com/sse/dc/dc_123/emits

Press Ctrl + C to terminate.
```

In a new shell, send an HTTP request to the endpoint URL for your event source, for example using `cURL`:

```
curl -d '{"name": "Luke"}' https://myendpoint.m.pipedream.net
```

You should see the HTTP request data displayed by the CLI:

```json
{
  "body": "{\"name\": \"Luke\"}",
  "headers": {
    "accept": "*/*",
    "content-length": "16",
    "content-type": "application/x-www-form-urlencoded",
    "host": "myendpoint.m.pipedream.net",
    "user-agent": "curl/7.64.1",
    "x-amzn-trace-id": "Root=1-5e56fefe-13fa3e702fe4366c8c7ee6e0",
    "x-forwarded-for": "1.1.1.1",
    "x-forwarded-port": "443",
    "x-forwarded-proto": "https"
  },
  "method": "POST",
  "path": "/",
  "query": {}
}
```

## Consume events from your source

There are a few ways to consume events sent to a source. Let's review them one-by-one.

### `pd events`

We saw above that the `pd deploy` command will begin listening for new events as soon as a source is created. This is nice the first time you deploy a source, but to retrieve events later you'll want to use `pd events`. You can return the last event sent to your source by running:

```
pd events -n 1 http
```

or, like above, you can listen for new events as they arrive:

```
pd events -f http
```

`http` is the default name associated with the [source you deployed above](https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http.js). `pd events` can accept the name of the ID of the source, which you can see by running `pd list sources`.

## Next Steps

[This source](https://github.com/PipedreamHQ/pipedream/blob/master/components/http/http.js) accepts any HTTP request and returns a 200 OK to the client. But you can modify this behavior in any way you'd like to validate the request, issue a custom response, or run any Node.js code you'd like. [Check out our other example HTTP sources](https://github.com/PipedreamHQ/pipedream/tree/master/components/http#example-http-sources) to learn more.

For more information on the Pipedream CLI, see the [command reference](/cli/reference/).

<Footer />
