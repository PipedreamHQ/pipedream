# Overview

Zoho Catalyst is a cloud-based backend for building and hosting serverless applications. With its API, you can create, read, update, and delete records in Catalyst Data Store, run Catalyst Functions, manage files in Catalyst File Store, and orchestrate various backend processes. Integrating Zoho Catalyst with Pipedream allows you to seamlessly connect these backend operations with other services and automate workflows. For example, you can trigger a function when you receive an email, process data from webhooks, or sync information between Zoho Catalyst and other platforms.

# Example Use Cases

- **Sync New Users to a Mailing List**: When new users sign up in a Zoho Catalyst app, you can automatically add their contact information to a mailing list in Mailchimp. This keeps your marketing efforts in sync and ensures that you're reaching out to the latest users of your app.

- **Automate File Backup to Cloud Storage**: Whenever a new file is uploaded to Zoho Catalyst File Store, you can create a workflow that automatically backs up the file to Google Drive, Dropbox, or another cloud storage service. This redundancy ensures that you always have a backup of critical files.

- **Process Payments and Update Inventory**: After a payment is processed via a platform like Stripe, you can use Pipedream to call Zoho Catalyst Functions that update inventory counts and generate a sales record in the Catalyst Data Store. This automation streamlines order fulfillment and inventory management.
