# Overview

DocRaptor is an API that converts HTML to PDF or XLS(X). Using DocRaptor with Pipedream allows you to automate document generation within your custom workflows. With Pipedream's serverless platform, you can trigger document creation from a multitude of events, process the data, and integrate it with countless apps to create dynamic, on-demand documents. Whether you need to generate invoices, reports, or any other documents, you can set up a pipeline that does the heavy lifting for you.

# Example Use Cases

- **Generate Monthly Reports**: Automatically create a PDF report from data in a Google Sheets document. Each month, trigger the workflow on Pipedream that fetches the latest data from Google Sheets, uses DocRaptor to generate a PDF, and then emails the report to stakeholders using a service like SendGrid.

- **Invoice Creation on New Orders**: When a new order is placed in an eCommerce platform like Shopify, trigger a workflow on Pipedream that creates a custom invoice using HTML/CSS templates. DocRaptor then converts this template into a PDF, which can be automatically sent to the customer or stored in cloud services like Dropbox.

- **Event-driven Financial Statements**: On the closing of a financial period, a webhook can trigger a Pipedream workflow that collates financial data, possibly from a database or accounting software like QuickBooks. With this data, generate an HTML template and use DocRaptor to transform it into a formatted XLSX financial statement ready for distribution or further analysis.
