# Overview

Notion's API allows for the creation, reading, updating, and deleting of pages, databases, and their contents within Notion. Using Pipedream's platform, you can build workflows that connect Notion with various other services to automate tasks such as content management, task tracking, and data synchronization. With Pipedream's serverless execution, you can trigger these workflows on a schedule, or by external events from other services, without managing any infrastructure.

# Example Use Cases

- **Content Sync Between Notion and a CMS**: Automatically push new blog posts from Notion to WordPress, ensuring a seamless content flow from drafting to publishing.

- **Task Management with Todoist Integration**: When a new task is added to a Notion database, create a corresponding task in Todoist, and vice versa, keeping task lists synced across platforms.

- **Daily Sales Report Generation**: Gather sales data from a tool like Shopify at the end of each day, sum up total sales, and create a page in Notion with the day's sales summary for easy reporting.

# Getting Started

To get started, first log in to or create your [Pipedream account](https://pipedream.com) and start a new workflow.

Add a Notion action or trigger to your workflow, then click **Select a Notion account** to open a Notion connection window:

![Selecting your Notion API account](https://res.cloudinary.com/pipedreamin/image/upload/v1715267108/marketplace/apps/notion/CleanShot_2024-05-09_at_11.04.34_pdb2rx.png)

From within this window, select pages you'd like Pipedream to access:

![Select the Notion pages that you'd like Pipedream to have access to](https://res.cloudinary.com/pipedreamin/image/upload/v1715267109/marketplace/apps/notion/CleanShot_2024-05-09_at_11.04.44_awccry.png)

Click **Accept** to connect your Notion account to Pipedream.

# Troubleshooting

## Unable to find a new database

After creating a new database, reconnect your account and select it to enable Pipedream access.

## HTTP errors

### 400 "invalid_json"
Ensure the request body is formatted as valid JSON.

### 400 "invalid_request_url"
The URL in your request is incorrect. Ensure the correct format and parameters.

### 400 "invalid_request"
The request type isn't supported. Ensure the correct format and parameters.

### 400 "invalid_grant"
Your authorization grant or refresh token is invalid, expired, or mismatched. Refer to OAuth 2.0 documentation.

### 400 "validation_error"
The request body doesn't match the expected parameters schema. You're most likely missing a key parameter, or a parameter is malformed.

### 400 "missing_version"
If your request lacks the required `Notion-Version` header, try adding a new Notion step in Pipedream, as it should handle this automatically.

### 401 "unauthorized"
If your API token is invalid, reconnect your Notion account to Pipedream.

### 403 "restricted_resource"
Your API token doesn't have permission to perform this operation. Try reconnecting your Notion account to Pipedream.

### 404 "object_not_found"
The requested resource doesn't exist or isn't shared with your API token. Double check that the block, database or page exists.

### 409 "conflict_error"
A conflict occurred, possibly due to outdated parameters. Try updating your parameters.

### 429 "rate_limited"
You've exceeded the number of allowed requests. Slow down your request rate.

### 500 "internal_server_error"
An unexpected error has occurred. Contact Notion support if it persists.

### 502 "bad_gateway"
Notion had a problem processing your request, possibly due to an upstream server issue.

### 503 "service_unavailable"
Notion is temporarily unavailable, possibly due to a long response time. Try again later.

### 503 "database_connection_unavailable"
Notion's database cannot be queried at the moment. Try again later.

### 504 "gateway_timeout"
Your request to Notion timed out. Try resending it after a while.
