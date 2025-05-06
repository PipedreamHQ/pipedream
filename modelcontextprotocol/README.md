# Pipedream MCP Server

This is a reference implementation of the Pipedream MCP server.

You can run this server yourself or use the hosted version at mcp.pipedream.com and chat.pipedream.com.
You can also directly integrate with [Pipedream Connect](https://pipedream.com/docs/connect/) to get
access to all the integrations.

We published this code as a reference, so you can better understand how to use Pipedream Connect for such
an application. This is still a work in progress, and not fully documented. Please reach out to us if you
have any questions.
## ⭐ Features

- Run **your own MCP server** for [over 2,500 apps and APIs](https://pipedream.com/apps)
- Manage servers **for your users**, in your own app.
- Connect accounts, configure params, and make API requests, all via tools
- Fully-managed OAuth and credential storage ([see security docs](https://pipedream.com/docs/privacy-and-security/#third-party-oauth-grants-api-keys-and-environment-variables))

## 🚀 Getting Started

Pipedream's MCP servers use the [Pipedream Connect API](https://pipedream.com/docs/connect/) to manage auth and make API requests. To run an MCP server, you'll need a Pipedream project and Pipedream API credentials.

1. [Sign up for Pipedream](https://pipedream.com/auth/signup)
2. [Create a project](https://pipedream.com/docs/workflows/projects/#creating-projects). Any accounts connected via MCP will be stored here.
3. [Create a Pipedream OAuth client](https://pipedream.com/docs/rest-api/auth/#creating-an-oauth-client)
4. Set the environment variables (See `.env.example`) (directly in your shell session, dot files, etc.)

There are two ways to use this MCP server. 

1 - App specific
  `/{uid}/{app}`
  This is currently available at [mcp.pipedream.com](mcp.pipedream.com). You can use an endpoint for each app. 
  All the tools available for that app will be available at that endpoint.

2 - Dynamic
    `/{uid}`
    This is a more experimental version, since it relies on tools being able to update dynamically.
    We use this server to power the tools on [chat.pipedream.com](chat.pipedream.com).

> [!NOTE]
> We made the code for the dynamic MCP server available in this repo. However you will not yet be able to run it locally.
> It relies on our internal Supabase instance. 
>
> Please let us know if you'd like to run this yourself.

## Hosting your own server

### Using the `Dockerfile`

If you have Docker installed locally, you can build and run the container:

```console
> docker build -t pipedream-connect .
> docker run -d --name pd-mcp -p 3010:3010 --env-file .env pipedream-connect:latest
```

This exposes a generic MCP server at [http://localhost:3010/:external_user_id/:app](http://localhost:3010/:external_user_id/:app).


## Development

`cp .env.example .env` and fill in the details of your dev project.

```bash
pnpm install
```

### Start the server with Streamable HTTP Transport
```bash
pnpm dev:http
```

You can use the optional env var `PD_SDK_DEBUG` to print out all the requests and responses going to the Connect API

```bash
PD_SDK_DEBUG=true pnpm dev:http
```

Then run the inspector:

```bash
npx @modelcontextprotocol/inspector
```

Use `http://localhost:3010/v1/{uuid}/{app}` for Streamable HTTP Transport or `http://localhost:3010/{uuid}/{app}` for SSE Transport.

These URLs can also be used by other clients (e.g. Cursor).


### Stdio Transport setup
Stdio has only been tested with the MCP Inspector.

```bash
npx @modelcontextprotocol/inspector bun src/stdio.ts
```

See the logs for the inspector URL.

Ensure the left side of the inspector matches this:

![Screenshot 2025-03-12 at 1 05 37 PM](https://github.com/user-attachments/assets/cc650999-353c-45da-add8-7d8de867d6ed)


Then press "List Tools" to fetch the list of MCP tools.

## License

Pipedream Source Available License Version 1.0 - See https://github.com/PipedreamHQ/pipedream/blob/master/LICENSE
