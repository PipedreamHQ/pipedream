# Overview

The Unity Cloud Build API lets you automate the process of setting up and distributing game builds. It's a powerful suite of tools allowing developers to personalize and streamline build tasks. With Pipedream, you can harness this API to integrate build processes with your existing tools, notify teams, deploy builds to platforms, and react to events in Unity Cloud Build in real-time.

# Example Use Cases

- **Automated Build Notifications via Slack**: Create a workflow on Pipedream that triggers when a new build is available in Unity Cloud Build. It can then send a message to a Slack channel to inform the team. This aids in keeping everyone up-to-date on the latest build status without manual checks.

- **GitHub Integration for Build Triggers**: Set up a Pipedream workflow that listens for GitHub push or pull request events. Upon detection, it can trigger a new build in Unity Cloud Build, effectively creating a continuous integration pipeline that ensures your game is always ready for the latest changes in your codebase.

- **Discord Notifications for Build Failures**: Configure Pipedream to monitor Unity Cloud Build for failed build events. When a build fails, automatically send a detailed report to a specified Discord server to prompt immediate action from the development team. This workflow helps in quickly addressing and resolving build issues.
