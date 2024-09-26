# Overview

The Robocorp API allows you to automate complex business processes by leveraging the power of robotic process automation (RPA). With this API, you can manage and run bots that perform tasks ranging from simple data entry to intricate workflows involving various systems and data sources. Integrating the Robocorp API with Pipedream opens up possibilities for orchestrating these automation tasks based on triggers from a multitude of web applications and services, streamlining processes without the need for manual intervention.

# Example Use Cases

- **Automated Report Generation and Distribution**: Use Robocorp to generate periodic financial reports. Trigger a workflow on Pipedream when a new row is added to a Google Sheets spreadsheet, which instructs Robocorp to process the data and generate a report. Once the report is ready, use Pipedream to send it via email to relevant stakeholders.

- **Issue Tracker Integration**: Integrate Robocorp with an issue tracking system like Jira. Whenever a high-priority issue is created in Jira, trigger a Pipedream workflow that instructs a Robocorp bot to perform an immediate diagnostic routine, log the results in the issue tracker, and notify the engineering team through Slack.

- **E-commerce Order Processing**: Automate the processing of new orders from an e-commerce platform like Shopify. When a new order is received, Pipedream can trigger a Robocorp bot to validate the order information, update inventory databases, and initiate the shipping process, ensuring a swift response to each customer purchase.
