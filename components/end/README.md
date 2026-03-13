# Overview

The End API on Pipedream allows you to terminate workflows prematurely based on specific conditions or logic. This can be incredibly useful for optimizing workflow execution and managing resource usage efficiently. By integrating conditional logic, you can ensure that your workflows only proceed when relevant criteria are met, avoiding unnecessary processing and API calls.

# Example Use Cases

- **Conditional Data Processing:** Build a workflow that ingests data from a webhook, checks if the data meets certain criteria (e.g., data completeness, threshold values), and uses the End API to stop the workflow early if the conditions are not met. This is ideal for scenarios where only high-quality data should trigger subsequent actions.

- **User Verification Process:** Create a user verification workflow that starts by receiving user details, checks these against a database using SQL or a similar query service, and employs the End API to terminate the workflow if the user does not exist or fails verification checks. This can help in maintaining system security and data integrity.

- **Resource-Intensive Task Management:** Design a workflow that begins with a trigger from a CPU-intensive task scheduler. Use the End API to evaluate system resource metrics (like CPU usage or memory available) pulled from a monitoring tool like Datadog, and halt the workflow if resources are too strained, preserving system performance and stability.
