# Overview

The ngrok API allows developers to manage ngrok tunnels that expose local development servers to the public internet over secure tunnels. With ngrok on Pipedream, you can automate tunnel lifecycle management, monitor tunnel statuses, and trigger actions in other services when specific tunnel events occur. This seamless integration enables efficient workflows, especially for remote debugging, webhook testing, and exposing local servers to clients or stakeholders without deploying.

# Example Use Cases

- **Automate Tunnel Creation for New Development Features**: Automatically set up ngrok tunnels when new GitHub branches are created. This can help developers immediately start testing new features with real-time feedback without manual configuration.

  - Trigger: GitHub - New Branch Created.
  - Action: ngrok - Create Tunnel.
  - Outcome: Instant testing environment setup for new features.

- **Dynamic Webhook Testing**: Use ngrok to expose a local webhook handler to the broader internet, and integrate with Pipedream's HTTP / Webhook triggers to process incoming webhook data. This setup is perfect for testing webhook integrations during development before deployment.

  - Trigger: ngrok - Tunnel Created.
  - Action: Pipedream - Receive Webhooks.
  - Outcome: Real-time webhook handling and testing from local development environments.

- **Client Demo with Real-time Updates**: When a local feature branch is ready for client review, automatically create an ngrok tunnel and send the URL via Slack. This allows clients to view progress in real-time, directly from the developer's machine.

  - Trigger: Git - Push to Repository (Specific Branch).
  - Action: ngrok - Create Tunnel.
  - Further Action: Slack - Send Message with Tunnel URL.
  - Outcome: Streamlined client demos and feedback sessions.
