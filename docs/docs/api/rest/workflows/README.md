# REST API example: Create an Workflow

Here, we'll walk through an example of how to create a [workflow](/workflow/) programmatically using the [create workflow endpoint](/api/rest/#create-a-workflow) from a [shared link](/workflows/sharing/), and pass your own connected accounts, step and trigger props as configuration.

Before you begin, you'll need your [Pipedream API Key](/api/auth/#pipedream-api-key).

[[toc]]

## Creating a new workflow from a template

Workflows can be shared as templates using a [Share Link](/workflows/sharing/). When you share a workflow, a unique key is created that represents that workflow's triggers, steps and settings.

However, opening shared workflow link with a browser will not include sharing private resources - such as connected accounts, sources and data stores. Connections to your private resources have to be populated by hand.

The [create workflow endpoint](/api/rest/#create-a-workflow) allows you to programmatically assign your own connected accounts, props within the workflow, and even deploy the workflow in a single API request.


### Step 1 - Create a workflow share link

First, you'll need to start with workflow template. To create a new workflow template, follow this short guide.

A shared workflow template URL has the following format:

```
https://pipedream.com/new?h=tch_abc123
```

The `tch_abc123` portion of the URL represents the unique workflow template ID. Copy this, you'll need it in the following steps.

:::tip You can create workflows from any Workflow Template

You're not limited to creating new workflows from your own templates, you can create your own workflows using this endopint with any shared workflow link.

:::

### Step 2 - View the workflow template

You'll need to view the shared workflow template's configuration so you can identify the props you'll need to configure for the triggers and steps within the workflow.

* `triggers` - represents the triggers for the workflow.
* `steps` - represents the series of steps within your workflow

`triggers` and `steps` contain [props](/workflows/steps/using-props/) that define the connected accounts as well as configuration.

The next step is to learn how we can pass our specific connected accounts to app based props in the `steps` and/or `triggers` of the workflow template.


### Step 2 - Find and connect your accounts

To connect your accounts to the workflow, you'll need to find the specific IDs for each of the accounts you'd like to connect.

You can find your connected account IDs by using the [List Accounts endpoint](/api/rest/#get-workspaces-s-connected-accounts).

You can filter your accounts by using the `app_slug` query parameter. For example, if you want to find your connected Slack accounts to your workspace, then add `slack` to the query param:

```
GET /workspaces/<workspace_id>/accounts?app_slug=slack
```

This request will narrow down the results to only your connected Slack accounts, for easier finding.

You'll need the ID of each connected account you'd like to configure this new workflow with. Copy down the `apn_******` value of the connected accounts from the response you'd like to use for the steps.

### Step 3 - Configure the props





### Step 4 - Send the request
