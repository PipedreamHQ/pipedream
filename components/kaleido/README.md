# Overview

Kaleido provides an API for creating and managing blockchain networks and services. By integrating with Pipedream, you can automate various blockchain tasks such as deploying smart contracts, managing consortia, and handling tokens without managing infrastructure. Pipedream's serverless platform enables you to connect Kaleido with 3,000+ other apps to create powerful and scalable workflows.

# Example Use Cases

- **Automated Smart Contract Deployment**: Deploy smart contracts to your blockchain network whenever a GitHub repository updates. The workflow triggers on a new commit, pulls the contract code, and uses Kaleido's API to deploy it, ensuring your network always runs the latest contract code.

- **Consortium Management Notifications**: Send Slack notifications when there's a change in your blockchain consortium. This workflow listens for events from Kaleido's API, such as a new member joining, and sends a message to your team's Slack channel to keep everyone informed in real-time.

- **Token Supply Monitoring**: Monitor and log the supply of your custom tokens by connecting Kaleido to Google Sheets. On a scheduled basis, this workflow retrieves the token balance from Kaleido, then appends the data to a Google Sheet for easy tracking and analysis.
