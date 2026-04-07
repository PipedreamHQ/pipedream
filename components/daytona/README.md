# Overview

Daytona provides secure, elastic sandbox infrastructure for AI agents. Each sandbox is a complete, isolated environment that is fully programmable, spun up on demand, and built for autonomous use without human intervention.

Using Pipedream, you can integrate Daytona into any automated workflow: create sandboxes from snapshots or custom images, clone repositories, execute code and shell commands, expose running services via preview URLs, and manage the full sandbox lifecycle — all as composable steps alongside thousands of other apps.

# Example Use Cases

- **AI Code Execution Pipeline**: Trigger a workflow when a new message arrives in Slack, send the message to an AI model (e.g., OpenAI) to generate code, then execute that code safely in a Daytona sandbox using the **Run Code** action and return the results back to Slack.

- **Automated Testing in Isolated Environments**: When a pull request is opened on GitHub, create a Daytona sandbox, **Clone the Git Repository** into it, run the test suite with **Run Command**, and post the results as a PR comment, all without touching your local infrastructure.

- **On-Demand Dev Environments**: Use a webhook or form trigger to spin up a Daytona sandbox, clone a repo, run setup commands via **Run Command** (e.g., `npm install`), start a dev server, and share the **Preview Link** with your team for review.

# Getting Started

## Authentication

Daytona uses API key-based authentication. To connect your Daytona account:

1. Go to [app.daytona.io/dashboard/keys](https://app.daytona.io/dashboard/keys)
2. Click **Create Key** and generate a new API key
3. In Pipedream, add a new Daytona connection and paste your API key

## Available Actions

| Action | Description |
|---|---|
| **Clone Git Repository** | Clone a public or private Git repository into a sandbox |
| **Create Sandbox** | Create a new isolated sandbox with configurable language, resources, and lifecycle settings |
| **Delete Sandbox** | Permanently delete a sandbox and all its data |
| **Get Sandbox** | Retrieve details about a specific sandbox |
| **Get Preview Link** | Get a preview URL for a service running on a specific port in a sandbox |
| **List Sandboxes** | List sandboxes with optional label filtering and pagination |
| **List Snapshots** | List available sandbox snapshots (pre-configured templates) |
| **Start Sandbox** | Start a stopped sandbox |
| **Stop Sandbox** | Stop a running sandbox |
| **Run Command** | Execute a shell command inside a sandbox |
| **Run Code** | Execute Python, TypeScript, or JavaScript code inside a sandbox |
| **Create SSH Access** | Generate a time-limited SSH access token for a sandbox |
| **Revoke SSH Access** | Revoke an SSH access token |
| **Wait Until Stopped** | Wait for a sandbox to reach the stopped state |

## Links

- [Daytona Documentation](https://www.daytona.io/docs)
- [Daytona Dashboard](https://app.daytona.io)
- [Daytona TypeScript SDK](https://www.daytona.io/docs/en/typescript-sdk)
- [API Reference](https://www.daytona.io/docs/en/tools/api)
