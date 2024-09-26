# Overview

The Expedy API provides a platform for automating the management of expenses, allowing you to upload receipts, categorize expenses, and generate reports. By leveraging the Expedy API within Pipedream, you can create serverless workflows that handle various aspects of expense tracking and report generation, without the need to manage infrastructure. This can lead to a significant reduction in manual work, increasing efficiency for individuals or finance teams.

# Example Use Cases

- **Automate Expense Reporting**: Create a Pipedream workflow that listens for new emails with receipts, extracts the attachment using an email service like Gmail, and then uploads the receipt to Expedy for processing and categorization.

- **Daily Expense Summary**: Schedule a daily Pipedream workflow that retrieves your latest expenses from Expedy and compiles them into a summary report, which is then sent to you via Slack to keep you updated on your spending.

- **Receipts to Cloud Storage Sync**: Set up a workflow that triggers whenever you add a new expense in Expedy, extracts the receipt image, and then uploads it to a cloud storage service like Dropbox, creating a backup for your records.
