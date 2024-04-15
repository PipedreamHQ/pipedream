# Overview

The Airtable (OAuth) API lets you interact programmatically with your Airtable databases, offering a way to create, read, update, and delete records within your tables. Harnessing this capability within Pipedream, you can automate workflows that respond to events in real-time, synchronize data across multiple platforms, and manipulate your Airtable records with minimal effort. Pipedream's serverless platform facilitates the extension of Airtable's functionality by connecting to various APIs, managing state, and processing complex logic without setting up a dedicated backend.

# Example Use Cases

- **Synchronize Airtable and Google Calendar**: Integrate Airtable with Google Calendar using Pipedream to sync events. When a new event is added to a specified Airtable base, trigger a workflow that creates a corresponding event in Google Calendar. Conversely, when a Google Calendar event is updated, reflect those changes back in the Airtable base. This keeps both calendars in sync seamlessly.

- **Automate Lead Capture to CRM**: When a new form submission is recorded in Airtable, trigger a Pipedream workflow that automatically adds or updates the lead information in a CRM like Salesforce. This process enhances lead management, ensuring no opportunity slips through the cracks due to manual data entry errors or delays.

- **Content Management Pipeline**: Construct a content management pipeline by triggering a Pipedream workflow whenever an Airtable record is updated or created. This pipeline could push content to CMS platforms like WordPress or integrate with static site generators to automatically publish or update web content. This helps to streamline content distribution and keep websites consistently updated.
