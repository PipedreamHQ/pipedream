# Overview

The Freedcamp API enables you to interact with your project management tools programmatically, offering a way to streamline, automate, and integrate your project workflows. With Pipedream, you can harness this API to create custom automations, such as syncing tasks, managing milestones, and tracking project updates. Pipedream's serverless platform offers a low-code approach, making it significantly simpler to connect Freedcamp with other apps and services to optimize your project management processes.

# Authentication

This integration uses **secured API key** authentication. You must use a secured key (not an unsecured or Zapier key).

1. Go to [My Account → Integrations → API](https://freedcamp.com/) in Freedcamp.
2. Generate a new **secured** API key.
3. Copy the **API Key** (public) and **API Secret**. You will need to enter your password to reveal the secret.
4. In Pipedream, connect your Freedcamp account and enter the API Key and API Secret.

The component signs each request with a timestamp and HMAC-SHA1 hash of `api_key + timestamp` using the API secret, as described in the [Freedcamp Public API](https://freedcamp.com/help_/tutorials/wiki/wiki_public/view/DFaab#authentification).

# Example Use Cases

- **Automated Task Syncing with Google Sheets**: Seamlessly sync new tasks created in Freedcamp with a Google Sheets spreadsheet. Every time a team member creates a task in Freedcamp, Pipedream detects the event and adds a new row to the sheet, keeping your task tracking up-to-date across platforms.

- **Slack Notifications for Project Milestones**: Keep your team informed with automated Slack messages whenever a milestone is reached in Freedcamp. Set up a Pipedream workflow that listens for milestone completions and then sends a customized notification to your Slack workspace, ensuring everyone is on the same page.

- **GitHub Integration for Development Tasks**: Connect Freedcamp with GitHub to automate the creation of GitHub issues based on specific tasks in Freedcamp. When a task labeled as a 'bug' or 'feature request' is added, Pipedream can automatically create an issue in the respective GitHub repository, streamlining the development workflow.
