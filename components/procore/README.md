# Overview

The Procore API offers a gateway to automate workflows within the construction management arena, enabling integration with Procore's robust project management tools. Through the API, you can access endpoints that manage documents, track project progress, handle financials, and enhance collaboration. Using Pipedream, you can create serverless workflows that trigger actions in Procore, respond to webhooks, and connect Procore with other apps to streamline operations, reduce manual entry, and keep all stakeholders updated in real-time.

# Example Use Cases

- **Automate Document Syncing with Dropbox**: Whenever a new document is uploaded to a Procore project, the workflow detects this event and automatically uploads a copy of the document to a specified Dropbox folder. This ensures all project-related files are backed up and accessible from anywhere.

- **Synchronize Project Updates to a Google Sheets Report**: Whenever a project update is posted in Procore, the Pipedream workflow captures the details and appends them to a Google Sheet. This can be used to create an automated log or report that is easily shareable with team members or stakeholders not using Procore.

- **Send Slack Notifications for New RFIs**: When new Requests for Information (RFIs) are created in Procore, a Pipedream workflow is triggered to send a notification with the RFI details to a designated Slack channel. This helps to keep the project team informed and ensures that RFIs are addressed promptly.
