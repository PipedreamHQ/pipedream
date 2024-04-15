# Overview

The MySQL API on Pipedream enables you to interact with your MySQL databases directly from the platform, allowing for seamless integration and automation of database operations. By leveraging Pipedream's serverless execution model, you can run SQL queries, insert, update, or delete records, and listen for changes in your database in real-time. Combine the power of MySQL with other apps and services available on Pipedream to create sophisticated workflows that trigger on various events, process data, and maintain your database without any infrastructure setup.

# Example Use Cases

- **Sync MySQL Data with Google Sheets**: Automatically update a Google Sheets spreadsheet whenever a new row is added to a MySQL database table. Useful for sharing database information with non-technical team members or for data visualization purposes.
- **Database Backup Notifications**: Set up a daily workflow that performs a backup of your MySQL database and sends a confirmation email via SendGrid or another email service once the backup is successful. Maintain peace of mind with regular, automated backups.
- **Order Processing Automation**: Whenever a new order is placed in a web app, trigger a Pipedream workflow that inserts the order details into a MySQL database. Then connect with Stripe to process payments, and update the database with payment confirmation.
