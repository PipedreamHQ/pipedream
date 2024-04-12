# Overview

You can execute custom Go scripts on-demand or in response to various triggers and integrate with thousands of apps supported by Pipedream. Writing with Go on Pipedream enables backend operations like data processing, automation, or invoking other APIs, all within the Pipedream ecosystem. By leveraging Go's performance and efficiency, you can design powerful and fast workflows to streamline complex tasks.

# Example Use Cases

- **Process Webhook Requests with Go**: Parse and handle incoming webhook data using a Go script. After processing, trigger actions in other services like Slack, sending notifications about the processed data.

- **Scheduled Data Aggregation**: Set up a cron job to routinely fetch data from external APIs (e.g., GitHub, Twitter) using Go. Process and aggregate this data, then store it in a Pipedream data store or send it to a Google Sheet for analysis and reporting.

- **IoT Device Data Processing**: Receive and process data from IoT devices on a real-time basis. Use Go to parse the device data, perform necessary computations, and then forward the results to services like AWS S3 or MQTT brokers for further use or visualization.
