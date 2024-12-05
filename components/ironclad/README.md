# Overview

Ironclad is a digital contracting platform that streamlines the contract lifecycle from drafting through approval, execution, and management. Using the Ironclad API, you can automate various aspects of contract management on Pipedream. This includes creating contracts, retrieving contract data, and automating approval workflows. When combined with other apps and services available on Pipedream, Ironclad can serve as the backbone for sophisticated, automated legal operations.

# Example Use Cases

- **Contract Approval Notification Workflow**: Automatically send Slack notifications when a new contract is ready for review in Ironclad. This workflow captures contract events in Ironclad, checks the status, and if pending approval, sends a message to the designated Slack channel with contract details and a direct link to the approval page.

- **Scheduled Contract Review**: Set up a recurring workflow in Pipedream that checks for contracts nearing their renewal date every month. If any are found, the workflow sends an email summary to the legal team via Gmail or Microsoft Outlook, ensuring timely reviews and renewals without manual tracking.

- **Integration with CRM for Contract Initiation**: When a new customer is added to Salesforce, trigger a workflow in Pipedream that automatically initiates a new contract in Ironclad using pre-defined templates relevant to the customer type or service. This helps in speeding up the sales process by reducing the manual work involved in contract creation.
