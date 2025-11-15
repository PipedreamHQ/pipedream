# Pipedream MCP Server

> **⚠️ Important Notice**: This MCP server is a **reference implementation only** and is no longer actively maintained. For production use, we recommend using Pipedream's **remote MCP server** instead.

## Recommended: Use Pipedream's Remote MCP Server

For the best experience, use Pipedream's hosted MCP server which provides:

- **2,800+ APIs and 10,000+ tools** through a single server
- **Built-in authentication**: no manual token management required
- **Multiple tool modes**: sub-agent and full configuration
- **Automatic app discovery**
- **Enterprise-grade reliability and security**

**🚀 Get started**: [Pipedream MCP Documentation](https://pipedream.com/docs/connect/mcp/developers)

> **🎮 Try it now**: Check out our [open source chat app](https://github.com/PipedreamHQ/mcp) at [chat.pipedream.com](https://chat.pipedream.com/)

---

## Self-Hosting (Reference Implementation)

This reference implementation shows how you can:

- [Run the servers locally](#running-the-server-via-npx) with `npx @pipedream/mcp`
- [Host the servers yourself](#hosting-your-own-server) to use them within your app or company

See the consumer-facing MCP server in action at [mcp.pipedream.com](https://mcp.pipedream.com) and check out a demo of the developer-facing product at [chat.pipedream.com](https://chat.pipedream.com).

We published this code as a reference, so you can better understand how to use Pipedream Connect for such an application. This is a reference implementation specifically for self-hosting the server and may not be fully documented.

**For production use, we strongly recommend using our [remote MCP server](https://pipedream.com/docs/connect/mcp/developers) instead.**

## ⭐ Reference Implementation Features

- Run **your own MCP server** for [over 2,800 apps and APIs](https://mcp.pipedream.com)
- Manage servers **for your users**, in your own app
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
This is currently available at [mcp.pipedream.com](https://mcp.pipedream.com). You can use an endpoint for each app.
All the tools available for that app will be available at that endpoint.

2 - Dynamic
`/{external_user_id}`
This is an experimental version, since it relies on tools being able to update dynamically.
We use this server to power the tools on [chat.pipedream.com](https://chat.pipedream.com).

> [!NOTE] > [Check out the docs](https://pipedream.com/docs/connect/mcp/app-discovery) to learn more about enabling app discovery with the MCP server.

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
