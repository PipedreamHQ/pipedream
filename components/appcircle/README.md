# Overview

The Appcircle API provides programmatic access to Appcircle's mobile CI/CD features, allowing you to automate build, test, and deployment processes for mobile apps. With it, you can trigger builds, fetch build outputs, manage distribution profiles, and more directly via HTTP requests. Integrating the Appcircle API with Pipedream unlocks a world of automation possibilities, where you can seamlessly connect your mobile app development workflow with other services and internal systems, streamlining your CI/CD pipeline.

# Example Use Cases

- **Automate Mobile App Builds**: Trigger a new build for your mobile app when changes are pushed to a specific branch on GitHub. Use Pipedream's GitHub integration to listen for `push` events and invoke the Appcircle API to start a new build process.

- **Distribute Builds to Testers**: After a successful build, use the Appcircle API to distribute the app to testers automatically. Set up a Pipedream workflow to watch for successful build notifications and connect with the Slack API to send download links directly to your testing team's Slack channel.

- **Sync Build Status with Project Management Tools**: Keep your project management tool in sync with the build status of your mobile app. Create a workflow on Pipedream that, upon a build completion, uses the Appcircle API to fetch the status and updates a task in Trello with the results.
