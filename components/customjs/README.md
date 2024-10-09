# Overview

The CustomJS API on Pipedream allows you to infuse custom JavaScript logic into your automated workflows, bridging the gap between predefined actions and unique business requirements. This flexibility is essential for handling tasks that need a specific logic which predefined actions cannot offer. With CustomJS, you can manipulate data, make conditional decisions, perform complex calculations, and much more, right within your Pipedream workflows.

# Example Use Cases

- **Data Transformation Pipeline**: Use CustomJS to transform data received from a webhook. For instance, format incoming JSON data from a sales platform, extract key metrics (like total sales, number of transactions, etc.), and send this transformed data to a Google Sheets spreadsheet for easy visualization and reporting.

- **Conditional Notifications System**: Employ CustomJS to analyze incoming alerts from a monitoring tool (like Datadog). Based on the severity of the alert, decide whether to send a simple notification via Slack (for minor issues) or escalate to urgent channels like PagerDuty for high-severity problems. This helps in managing IT alerts more efficiently by reducing noise and focusing on critical issues.

- **Dynamic Content Curation for Email Marketing**: Integrate CustomJS with your email marketing platform, such as Mailchimp, to dynamically customize email content based on subscriber activity. For example, fetch latest blog posts from your CMS, select content based on the user’s past interactions (using JavaScript to filter and sort data), and compile a personalized email newsletter, enhancing engagement through relevant content.
