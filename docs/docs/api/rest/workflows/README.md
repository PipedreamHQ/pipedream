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

This guide will also work for any shared workflow link, although we recommend copying the workflow to your account first so you can view the workflow's available configurable props.

:::

### Step 2 - Create the workflow, and view the parameters 

You'll need to view the shared workflow's configuration so you can identify the props you'll need to configure for the triggers and steps within the workflow.

Use the **Get Workflow** endpoint to retrieve the details about the workflow you've created a template for.

In the Get Workflow API response, you'll see two properties:

* `triggers` - represents the triggers for the workflow.
* `steps` - represents the series of steps within your workflow

`triggers` and `steps` contain [props](/workflows/steps/using-props/) that define the connected accounts as well as configuration.

The next step is to learn how we can pass our specific connected accounts to app based props in the `steps` and/or `triggers` of the workflow template.

Within the `steps` and `triggers`, find the `configurable_props` for the trigger. Here is where you can find the available slots that you can programmtically provide configuration for the **Create Workflow** endpoint:

```json{5-10,25-39}
// Example of a Get Workflow response
{
  "triggers": [
    {
      "id": "dc_abc123",
      "configurable_props": [
        {
          "name": "url",
          "type": "string"
        }
      ],
      "configured_props": {},
      "active": true,
      "created_at": 1707170044,
      "updated_at": 1707170044,
      "name": "New Item in Feed",
      "name_slug": "new-item-in-feed"
    },
  ],
  "steps": [
      "namespace": "send_message",
      "lang": "nodejs20.x",
      "component": true,
      "savedComponent": {
        "id": "sc_abc123",
        "configurableProps": [
          {
            "name": "slack",
            "type": "app",
            "app": "slack"
          },
          {
            "name": "channelId",
            "type": "string"
          },
          {
            "name": "message",
            "type": "string"
          }
        ]
      }
    }
  ]
}
```

For the example workflow above, the RSS feed trigger has a `url` property, and the Slack step as a `slack`, `channelId` and `message` property. We'll use these names in the next steps as arguments for the **Create Workflow** endpoint.


### Step 2 - Design the payload

Now that we have the names of the configurable props for both the `triggers` and `steps` of the workflow, let's design the payload for creating a new instance of the workflow.

First, populate the `project_id` and `org_id` where you'd like this new workflow to be instantiated under. Please refer to the [**Create Workflow** parameters documentation](/api/rest/#create-a-workflow) on how to find these values.

The `template_id` for your workflow can be found from the URL of the shared workflow link you created in **Step 1** of this guide.

The `trigger` as a `url` prop, so let's provide it with a specific URL (`https://hnrss.org/newest?q=Pipedream`) for this new workflow:

```json{7-11}
// Example of a Create Workflow request payload
{
  "project_id": "proj_abc123",
  "org_id": "o_abc123",
  "template_id": "tch_abc123",
  "triggers": [
    {
      "props": {
        "url": "https://hnrss.org/newest?q=Pipedream"
      }
    }
  ]
}
```

:::tip Triggers are addressable by index

You may have noticed that we didn't include the `namespace` argument to the trigger in our payload. This is because triggers are ordered sequentially, whereas steps need a `namespace` argument for proper addressing.

:::

If we were to send this payload to the **Create Workflow** endpoint now, it will populate the *RSS - New Item in Feed* trigger with the feed we provided.

You can also populate the `steps` props as well. 

The *Slack - Send message in a Public Channel* step requires a `channelId`, `message` and the connected Slack account (`slack`). Let's start with connecting the Slack account.

#### Find your connected accounts

To connect your accounts to the workflow, you'll need to find the specific IDs for each of the accounts you'd like to connect.

You can find your connected account IDs by using the [List Accounts endpoint](/api/rest/#get-workspaces-s-connected-accounts).

You can filter your accounts by using the `app_slug` query parameter. For example, if you want to find your connected Slack accounts to your workspace, then add `slack` to the query param:

```
GET /workspaces/<workspace_id>/accounts?app_slug=slack
```

This request will narrow down the results to only your connected Slack accounts, for easier finding.

You'll need the ID of each connected account you'd like to configure this new workflow with. Copy down the `apn_******` value of the connected accounts from the response you'd like to use for the steps.

```json{10}
{
  "page_info": {
    "total_count": 1,
    "count": 1,
    "start_cursor": "YXBuXzJrVmhMUg",
    "end_cursor": "YXBuXzJrVmhMUg"
  },
  "data": [
    {
      "id": "apn_abc123",
      "name": "Slack Pipedream Workspace"
    }
  ]
}
```

Now we can copy the ID for our Slack account from the response: `apn_abc123`.

Given we now have the connected account ID, we can design the rest of the payload:

```json{13-20}
{
  "project_id": "proj_abc123",
  "org_id": "o_abc123",
  "template_id": "tch_3BXfWO",
  "triggers": [
    {
      "props": {
        "url": "https://hnrss.org/newest?q=Pipedream"
      }
    }
  ],
  "steps": {
    {
      "namespace": "send_message",
      "props": {
        "slack": {
          "authProvisionId": "apn_abc123",
        }
        "channelId": "U12356",
        "message": "**New HackerNews Mention** \n \n {{steps.trigger.event.item.title}} \n {{steps.trigger.event.item.description}}"
      }
    }
  }
}
```
Our payload now instructs Pipedream to set up the `send_message` step in our workflow with our connected Slack account and specific `channelId` and `message` parameters.

### Step 4 - Define settings (optional)

You can also define workflow settings such as the workflows, name, allocated memory, or if it should be deployed immediately:

```json{22-25}
{
  "project_id": "proj_abc123",
  "org_id": "o_abc123",
  "template_id": "tch_3BXfWO",
  "triggers": [
    {
      "props": {
        "url": "https://hnrss.org/newest?q=Pipedream"
      }
    }
  ],
  "steps": {
    {
      "namespace": "send_message",
      "props": {
        "slack": {
          "authProvisionId": "apn_abc123",
        }
        "channelId": "U12356",
        "message": "**New HackerNews Mention** \n \n {{steps.trigger.event.item.title}} \n {{steps.trigger.event.item.description}}"
      }
    }
  },
  "settings": {
    "name": "New HackerNews Mentions to Slack",
    "auto_deploy": true
  }
}
```

The `auto_deploy` option instructs Pipedream to deploy this workflow automatically, without requiring a manual deployment from the dashboard.

### Step 4 - Send the request

Finally, send the request to create this new workflow with this payload we've designed.

You should see the new workflow within your Pipedream dashboard under the workspace and project defined in the payload.

You can use this request to dynamically create new instances of the same workflow with different props, connected accounts and settings.
