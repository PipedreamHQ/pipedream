# Overview

ZeroTier is a smart Ethernet switch for Earth. It's a global distributed network that connects devices, VMs, and apps with a simple, secure, and ubiquitous network fabric. The ZeroTier API allows you to manage networks, members, and access rules programmatically. With Pipedream's capabilities, you can automate interactions with ZeroTier, integrating it seamlessly with other apps and services to orchestrate complex workflows, react to events, or sync data across platforms.

# Example Use Cases

- **Automated Network Provisioning**: When new employees are onboarded, you could use the ZeroTier API on Pipedream to automatically provision access to necessary networks. This could be triggered by an HR system like BambooHR, where a new user creation event kicks off a workflow that adds the user to specified ZeroTier networks.

- **Dynamic Access Control Based on External Events**: Imagine a security system like Okta issuing a command to restrict network access in response to a potential threat. Using Pipedream, you could listen for such events and use the ZeroTier API to modify network access rules, removing or altering member permissions in real-time, thus enhancing your overall security posture.

- **Sync Network Status with Monitoring Tools**: Use Pipedream to connect ZeroTier with monitoring tools like Datadog. You can set up a workflow that periodically checks the status of your ZeroTier networks and members, then logs this info into Datadog for analysis. This way, you can keep an eye on network health, usage patterns, and preemptively spot issues before they escalate.
