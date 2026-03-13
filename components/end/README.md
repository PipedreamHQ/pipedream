# Overview

The End API on Pipedream allows you to terminate workflows conditionally or unconditionally before they complete all programmed steps. This feature is crucial for creating efficient workflows that don’t waste resources by continuing execution when a certain condition is met, or a specific outcome is already achieved. It's especially useful in scenarios involving decision-making processes, error handling, or fulfilling a condition early in the workflow sequence.

# Example Use Cases

- **Conditional Termination in Data Enrichment**: Imagine a workflow triggered by new email leads. It checks if the email is already in your CRM. If it is, the End API can stop the workflow early, avoiding unnecessary steps like re-verifying the lead or attempting to add it again. Connect this with the Salesforce API to check and update lead status dynamically.

- **Budget Monitoring System**: Set up a workflow that monitors your company's spending against the budget. Use the End API to terminate the workflow when spending reaches a predefined threshold. This could be connected to finance management tools like QuickBooks or Xero, where transaction data triggers the workflow.

- **Content Moderation Automation**: In a system where user-generated content is automatically reviewed for compliance, use the End API to end the review process if content is flagged by preliminary checks as inappropriate. This can be integrated with machine learning models for initial content scanning and connected to a database like PostgreSQL to log moderation outcomes.
