# Overview
 
The Notion Create Page from Data Source action allows you to add pages to a Notion Data Source.

This action features easy to use dropdowns that automatically populate your data source as well as your data source's properties, also known as columns.

This action interacts with the [Notion create a Page API endpoint](https://developers.notion.com/reference/post-page). The Data Source selected in the `Parent Data Source ID` is used as the `parent_id` parameter to that endpoint so the page is added to your data source.

# Getting Started

<iframe width="560" height="315" src="https://www.youtube.com/embed/wciWsu564_0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
 
[Follow this short 4 minute guide to connect your Notion account and add new Data Source pages](https://youtu.be/wciWsu564_0) (note: as of 2025-09-02, Databases are divided into multiple Data Sources, which are the entities that contain the pages)

### Props

When using the **Create Page from Data Source** action, there are several props to define:

1. `Notion Account` - see the **Accounts** section below.
2. `Parent Data Source ID` - the data source to add a page to.
3. `Meta Types` - an icon or cover to add to the new page (optional).
4. `Property Types` - one or more properties to add to the new page that correspond with columns in the data source.
5. `Page Content` - the content of the page that appears when it's opened in a side view.

Each selected `Property Type` will also add a new prop for that given column.
 
### Accounts
 
1. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts).
2. Click on the **Click Here To Connect An App** button in the top-right.
3. Search for "Notion" among the list of apps, and select it.
4. This will open a new window asking you to allow Pipedream access to your Notion workspaces and pages. Choose which workspaces and pages you'd like to use in Pipedream, then click **Allow**.
5. That's it! You can now use this Notion account in any [actions](#workflow-actions), or [link it to any code step](/connected-accounts/#connecting-accounts).
 
### Within a workflow
 
1. [Create a new workflow](https://pipedream.com/new).
2. Select your trigger (HTTP, Cron, etc.).
3. Click on the **+** button below the trigger step, and search for "Notion".
4. Select the **Create Page from Data Source** action.
5. Click the **Connect Account** button near the top of the step. This will prompt you to select any existing Notion accounts you've previously authenticated with Pipedream, or you can select a **New** account. Clicking **New** opens a new window asking you to allow Pipedream access to your Notion workspaces and pages. Choose the workspaces and pages where you'd like to install the app, then click **Allow**.
6. That's it! You can now connect to the Notion API using any of the Slack actions within a Pipedream workflow.
 
# Troubleshooting
 
If your data source doesn't appear under the options, try deleting your Notion account connection and reconnecting.

There's an issue with Notion Data Sources not appearing in the options if the Data Source was created _after_ you connected your Notion account to Pipedream.