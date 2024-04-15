# Overview

NocoDB is an open-source platform that turns any database into a smart spreadsheet interface. It allows you to create, read, update, and delete database records through a user-friendly GUI. With the NocoDB API, you can programmatically interact with your data, automating CRUD operations and syncing with other systems. In Pipedream, you can leverage this API to build serverless workflows that connect your NocoDB data with hundreds of other apps, enabling a wide range of automation possibilities.

# Example Use Cases

- **Automate Data Entry**: Set up a workflow that listens for new submissions from a web form app like Typeform. Whenever a new submission is received, the workflow creates a new record in a NocoDB table, keeping your database updated automatically.

- **Sync Contacts Between Platforms**: Create a workflow that triggers when new contacts are added to your CRM, such as Salesforce. The workflow then checks for these contacts in NocoDB and updates or inserts them as needed, ensuring your contact lists are in sync across platforms.

- **Issue Tracking Integration**: Implement a workflow that connects NocoDB to a project management tool like GitHub. Each time an issue is updated or closed in GitHub, the corresponding record in NocoDB's issue tracking table is automatically updated, providing real-time project status tracking.
