# Overview

MongoDB API on Pipedream allows you to leverage MongoDB's capabilities within serverless workflows, automating tasks such as data insertion, querying, updates, and deletions. You can orchestrate these operations in response to HTTP requests, schedules, or events from over 300+ Pipedream-supported apps. By connecting MongoDB to other services, you can synchronize data across platforms, process and analyze collected data, and react to changes in real-time, all within Pipedream's easy-to-use interface.

# Example Use Cases

- **Data Synchronization Between MongoDB and Google Sheets**: Automatically update a Google Sheet when a new document is added to a MongoDB collection. This workflow can keep a Google Sheet in sync with your MongoDB data, perfect for sharing live reports or data visualizations with non-technical stakeholders.

- **Real-time Order Processing**: Trigger a workflow when new orders are inserted into a MongoDB collection, verifying the order details and then performing further actions such as sending a confirmation email via SendGrid or updating inventory counts in another system. This can help in streamlining e-commerce operations.

- **Customer Feedback Analysis**: Capture customer feedback from a web form submission, stored in MongoDB, and analyze sentiment using the Google Natural Language API. Follow up with personalized customer service actions like generating a support ticket in Zendesk or sending a thank you message.
