# Overview

Snowflake offers a cloud database and related tools to help developers create robust, secure, and scalable data warehouses. See Snowflake's [Key Concepts & Architecture](https://docs.snowflake.com/en/user-guide/intro-key-concepts.html).

## Getting Started

### 1. Create a user, role and warehouse in Snowflake

Snowflake recommends you create a new user, role, and warehouse when you integrate a third-party tool like Pipedream. This way, you can control permissions via the user / role, and separate Pipedream compute and costs with the warehouse. **We recommend you [create a read-only account](https://docs.snowflake.com/en/user-guide/organizations-manage-accounts.html) if you only need to query Snowflake**.

### 2. Enter those details in Pipedream

1. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts)
2. Click the button to **Connect an App**
3. Enter the required Snowflake data.

You'll only need to connect your account once in Pipedream. You can use this account to run queries against Snowflake, insert data, and more.

### 3. Build your first workflow

Visit [https://pipedream.com/new] to build your first workflow. Pipedream workflows let you connect Snowflake with 1,000+ other apps. You can trigger workflows on Snowflake queries, sending results to Slack, Google Sheets, or any app that exposes an API. Or you can accept data from another app, transform it with Python, Node.js, Go or Bash code, and insert it into Snowflake.

Learn more at [Pipedream University](https://pipedream.com/university).
