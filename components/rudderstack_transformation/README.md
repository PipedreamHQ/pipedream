# Overview

The RudderStack Transformation API enables you to process and transform data before it's delivered to your data warehouse or other analytics tools. Within Pipedream, you can harness this API to customize the shape and structure of your data, apply business logic, filter out unnecessary information, or enrich data with additional attributes before forwarding it.

# Example Use Cases

- **Enrich CRM Data Before Storage**: Use the RudderStack Transformation API in Pipedream to enrich leads with extra information from an external API (like Clearbit) before inserting them into your CRM. This can help create a richer profile of your leads directly in your CRM system.

- **Filter and Redirect Event Streams**: Create a Pipedream workflow that ingests event data from a source app, uses RudderStack to apply transformations like filtering out events that don't meet certain criteria, and then directs the clean data to specific endpoints such as Google Analytics or your custom analytics service.

- **Real-time Data Validation and Transformation**: Set up a Pipedream workflow where incoming data from a service like Typeform is validated and transformed using RudderStack. The transformed data could then be sent to a database like PostgreSQL, ensuring only clean, structured data is stored.
