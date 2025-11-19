# Overview

The Nano Nets API offers machine learning capabilities to classify images, extract data, and automate processes with custom models. Through Pipedream's serverless platform, you can trigger workflows from various events, manipulate and route data from the Nano Nets API, and connect it to 3,000+ other apps to automate complex tasks. Pipedream's built-in code steps also allow you to transform data, make HTTP requests, and handle logic right inside your workflows.

# Example Use Cases

- **Automated Content Moderation**: Use the Nano Nets API to analyze user-uploaded images on your platform. Set up a workflow on Pipedream that triggers when a new image is uploaded, sends it to Nano Nets for analysis, and if the content is flagged as inappropriate, automatically remove the image and notify admins via Slack.

- **Intelligent Invoice Processing**: Create a Pipedream workflow that triggers when new invoice images are added to a Dropbox folder. Use the Nano Nets API to extract structured data from these invoices, and then store the data in a Google Sheets spreadsheet for easy tracking and analysis.

- **Real-time Inventory Management**: Implement a workflow that starts when an inventory count is done via image capture. The images are processed by the Nano Nets API to identify and count items, with the results sent to an Airtable base to update inventory levels, and a notification sent through email using SendGrid if stock for any item is low.
