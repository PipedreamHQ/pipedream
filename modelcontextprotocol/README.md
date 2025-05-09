# Pipedream MCP Server

This is a reference implementation of the Pipedream MCP server. You can run **your own MCP server** for [over 2,500 apps and APIs](https://pipedream.com/apps) and is powered by [Pipedream Connect](https://pipedream.com/docs/connect/).

You can:

- [Run the servers locally](#running-the-server-via-npx) with `npx @pipedream/mcp`
- [Host the servers yourself](#hosting-your-own-server) to use them within your app or company

See the server in action at [mcp.pipedream.com](https://mcp.pipedream.com) and [chat.pipedream.com](https://chat.pipedream.com)

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
4. Set the environment variables (See `.env.example`) (directly in your shell session, dot files, etc.):

```bash
PIPEDREAM_CLIENT_ID=your_client_id
PIPEDREAM_CLIENT_SECRET=your_client_secret
PIPEDREAM_PROJECT_ID=your_project_id
PIPEDREAM_PROJECT_ENVIRONMENT=development
```

### Pipedream concepts to understand

If you're running MCP servers for your app, you'll likely want to use the [SSE interface](#sse). The SSE server accepts two route params:

1. `external_user_id` — This is your user’s ID, in your system — whatever you use to uniquely identify them. Any requests made to that route are coupled to that end user, and would use the auth Pipedream stores for that user. [See the docs](https://pipedream.com/docs/connect/api/#external-users) for more detail.
2. `app` — The app's "name slug" (the unique identifier for the app), found in the **Authentication** section of [any Pipedream app](https://pipedream.com/apps). For example, the app slug for [Slack](https://pipedream.com/apps/slack) is `slack`.

If your user `123` wants to connect to the `slack` MCP server, your MCP client would make a request to the `/123/slack` route. [See the SSE docs below](#sse) for more detail.

## Server overview

There are two ways to use this MCP server.

1 - App specific
`/{external_user_id}/{app}`
This is currently available at [mcp.pipedream.com](mcp.pipedream.com). You can use an endpoint for each app.
All the tools available for that app will be available at that endpoint.

2 - Dynamic
`/{external_user_id}`
This is an experimental version, since it relies on tools being able to update dynamically.
We use this server to power the tools on [chat.pipedream.com](https://chat.pipedream.com).

> [!NOTE]
> The code for the dynamic MCP server is available in this repo but you will not _yet_ be able to run it locally since it relies on an internal db.
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

Use `http://localhost:3010/v1/{external_user_id}/{app}` for Streamable HTTP Transport or `http://localhost:3010/{external_user_id}/{app}` for SSE Transport.

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
