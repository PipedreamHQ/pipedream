# Overview

The Quaderno API provides robust capabilities for handling sales tax, VAT, and GST compliance. It allows you to automate tax calculations, create and send invoices, and manage transactions and reports with ease. Integrating the Quaderno API on Pipedream opens up opportunities to streamline your finance operations by connecting to various other services like CRMs, payment gateways, and e-commerce platforms, all while leveraging Pipedream's serverless platform to execute custom logic without managing infrastructure.

# Example Use Cases

- **Automated Tax Compliance for E-Commerce Sales**: Set up a workflow that triggers whenever a new order is placed in your e-commerce platform (like Shopify). The workflow calculates the appropriate taxes using Quaderno, creates an invoice, and then stores the transaction details in a Google Sheet for record-keeping.

- **Invoice Generation on Subscription Renewal**: Each time a subscription renews in a payment service like Stripe, trigger a Pipedream workflow that uses Quaderno to generate an invoice with the correct tax rates and sends it to the customer via email, simplifying the recurring billing process.

- **Expense Tracking and Reporting**: Create a workflow that listens for new expenses entered in an accounting app like QuickBooks. When a new expense is detected, the workflow adds the expense to Quaderno, calculates the tax implications, and then updates a dashboard in a BI tool like Tableau, providing real-time expense tracking and insights.
