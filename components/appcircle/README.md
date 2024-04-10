# Overview

The Appcircle API provides a suite of tools for automating mobile app builds, testing, and distribution processes. With the Appcircle API on Pipedream, you can create custom workflows to integrate your mobile app development pipeline with various services, trigger builds, fetch build statuses, and distribute your applications automatically. By leveraging Pipedream's serverless execution model, developers can respond to events with code, connecting Appcircle to countless other services to streamline development operations.

## Example Appcircle Workflows on Pipedream

1. **Automate Mobile App Builds After Code Commits**: Set up a workflow that triggers a new build in Appcircle whenever a new commit is pushed to a specified branch in your GitHub repository. You can add steps to notify your team via Slack or email once the build is completed.

2. **Distribute Beta Builds on TestFlight**: Create a workflow that automatically distributes the latest successful build from Appcircle to beta testers on TestFlight. Integrate with the Apple Developer API to manage TestFlight submissions, ensuring testers always have access to the latest pre-release versions.

3. **Monitor and Report Build Failures**: Configure a workflow that monitors build statuses and sends a detailed report to your project management tool, such as Jira, when a build fails. Include steps to analyze logs and attach them to the Jira issue for easier debugging by your development team.
