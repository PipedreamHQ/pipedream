# Overview

Docupilot offers powerful document automation capabilities, allowing you to create dynamic documents based on templates and data inputs. With the Docupilot API, you can integrate this functionality directly into Pipedream workflows, triggering document generation from a myriad of events and data sources. Think of automating contract creation when a new deal is won in your CRM, or sending personalized letters en masse with the click of a button. The API empowers you to craft, distribute, and manage documents efficiently and programmatically.

# Example Use Cases

- **Automated Contract Generation for CRM Deals**: When a new deal is marked as won in a CRM like Salesforce, trigger a Pipedream workflow that collects deal details and customer data, then uses Docupilot to generate a personalized contract, which can be sent out for e-signature via an app like HelloSign.

- **Custom Reports on Schedule**: Merge data from a SQL database or a data analytics platform like Google Analytics into a Docupilot template to generate custom reports. Set up a Pipedream cron job to run this workflow weekly, sending the freshly minted report to stakeholders via email or Slack.

- **On-Demand HR Document Creation**: With a trigger from an HR platform like BambooHR or from a Pipedream HTTP endpoint, you can kick off creation of employee-related documents such as offer letters or performance reviews, which are then stored in a cloud service like Google Drive and shared with the relevant parties.
