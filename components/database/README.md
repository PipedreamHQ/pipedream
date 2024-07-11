# Overview

The Database API on Pipedream allows users to execute SQL commands directly within workflows, enabling rich and dynamic data manipulation and storage. It supports PostgreSQL, MySQL, and SQLite, making it a versatile option for managing data across various database systems. With this API, users can perform tasks such as data insertion, querying, updates, and deletions, directly within their automations, facilitating real-time data processing and integration across multiple platforms.

# Example Use Cases

- **Customer Data Sync Across Platforms**: Automatically sync customer data between a CRM platform like Salesforce and a PostgreSQL database on Pipedream whenever new data is entered or updated in Salesforce. This workflow ensures that all customer information remains consistent and up-to-date across enterprise systems.

- **Real-time Analytics Dashboard Update**: Set up a workflow that pulls new transaction data from an e-commerce platform (e.g., Shopify) into a MySQL database every hour and processes this data to update a real-time analytics dashboard. This can help in monitoring sales trends, customer behavior, and inventory levels, providing actionable insights almost instantly.

- **Automated Backup of Critical Data**: Create a nightly workflow that backs up critical data from a production database to a SQLite database on Pipedream. This can include important transaction data, user information, or any other data deemed critical for business operations, ensuring data safety and compliance with data governance standards.
