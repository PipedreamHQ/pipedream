# Overview

The End API on Pipedream allows users to terminate workflows early based on specific conditions or logic. This functionality is crucial for creating efficient and conditional automations where certain paths of execution are only relevant under specific circumstances. By integrating the End API, developers can better manage workflow performance and costs by stopping execution as soon as all relevant conditions have been met or if a particular endpoint is unnecessary for a given run.

# Example Use Cases

- **Conditional Order Processing**: Automatically end a workflow if a product is out of stock after checking inventory levels. This prevents unnecessary processing such as payment processing and shipping logistics for orders that cannot be fulfilled.

- **Content Moderation**: In a user-generated content platform, use the End API to stop further processing of the content if it is flagged as inappropriate in initial checks. This can save computational resources and human moderation time by preventing the propagation of content that violates platform policies.

- **Customer Support Ticket Routing**: End the workflow early if a customer support ticket is identified as a duplicate or if it pertains to an issue that has been resolved. This can help in focusing support efforts on new or currently unresolved tickets, enhancing support efficiency.
