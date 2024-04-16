# Overview

Rasa is an open-source platform for building conversational AI applications, including chatbots and voice assistants. It offers robust API endpoints for training models, managing conversations, and interpreting user messages, thus enabling the development of sophisticated AI-driven communication tools. When used with Pipedream, Rasa can automate dialogue flow, extract insights from conversation data, or trigger actions in other apps based on conversational cues.

# Example Use Cases

- **Customer Support Automation**: Connect Rasa to a CRM tool like Salesforce on Pipedream. Every time Rasa processes a customer's question and recognizes an issue, a new case is created in Salesforce, tagged with the conversation details and assigned to the appropriate support team.

- **Survey Collection Bot**: Use Rasa to deploy a chatbot that conducts surveys. On Pipedream, set up a workflow where each completed survey interaction triggers a Google Sheets API to log responses. This automates data collection and centralization for analysis, saving time and ensuring organized data management.

- **Event-Driven Notifications**: Pair Rasa with the Slack API on Pipedream to send notifications. When Rasa's NLU engine detects specific entities or intents like 'urgent' during a conversation, trigger a workflow that sends a Slack message to a designated channel or user, ensuring fast response times for critical issues.
