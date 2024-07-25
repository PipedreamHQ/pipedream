# Overview

The End API on Pipedream allows users to terminate workflows early based on specific conditions. This API is particularly useful in scenarios where certain criteria being met (or not met) can decide whether the continuation of a workflow is necessary, optimizing resource usage and execution time. By integrating conditional logic directly into your workflows, the End API enables more efficient data processing, tailored responses based on dynamic inputs, and streamlined operations without redundant actions.

# Example Use Cases

- **Conditional Order Processing**: Automatically end a workflow if a customer's order doesn't meet the minimum price threshold. Useful for e-commerce platforms where orders below a certain amount are not processed or are handled differently.
  - Trigger: New order received in Shopify.
  - Condition: Check if the order total is less than $50.
  - Action: Use the End API to terminate the workflow early if the condition is true.
  - Else: Continue to process the order, perhaps sending it to a fulfillment service like ShipStation.

- **Content Moderation**: End the workflow early if submitted content passes moderation filters. Ideal for social platforms or user-generated content services where only appropriate content needs further processing.
  - Trigger: New post submission detected.
  - Check: Analyze the content for inappropriate or flagged keywords using a text analysis tool.
  - Action: If no flagged content is found, use the End API to stop further processing.
  - Else: Escalate the content for manual review or notify administrators.

- **Customer Support Ticket Triage**: Terminate the workflow early if a support ticket is flagged as low priority, allowing your team to focus on high-priority issues more efficiently.
  - Trigger: New support ticket created in Zendesk.
  - Check: Assess ticket priority based on keywords or sender information.
  - Action: Use the End API to halt processing for low-priority tickets.
  - Else: Route the ticket to the appropriate support queue for immediate attention.
