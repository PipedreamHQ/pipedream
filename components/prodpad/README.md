# Overview

The ProdPad API taps into the core functionalities of product management, allowing you to automate interactions with your product backlog, roadmaps, and idea pools. With Pipedream's serverless execution environment, you can trigger workflows based on events in ProdPad, sync data across multiple platforms, and create custom automations to streamline your product management processes. ProdPad's API lets you seamlessly integrate with other tools to keep your team aligned, informed, and productive.

# Example Use Cases

- **Idea Submission Automation**: When a new idea is submitted to ProdPad, use Pipedream to trigger a workflow that automatically categorizes the idea based on predefined rules, assigns it to the appropriate team, and sends notifications via Slack or email to relevant stakeholders. This ensures that new ideas are quickly processed and evaluated.

- **Feedback Loop Enhancement**: Integrate ProdPad with customer support tools like Zendesk or Intercom. Whenever feedback is received, it can trigger a Pipedream workflow that creates or updates ideas in ProdPad, linking them back to the customer tickets. This ensures valuable user feedback is directly tied to potential feature development in the product roadmap.

- **Product Roadmap Synchronization**: Keep your product roadmap in sync with project management tools such as Jira or Trello. When changes are made to the roadmap in ProdPad, Pipedream can catch these events and update corresponding tasks, stories, or epics in your project management tool, ensuring all teams are working from the latest plan.

# Getting Started

## Webhooks

Some triggers support webhooks for ProdPad. These include:

- New Pushed Idea
- New Pushed User Story

To set up a webhook, please create and deploy one of these triggers and copy the HTTP URL.
Then follow the instructions on [this link](https://help.prodpad.com/article/759-create-a-custom-webhook).
