# Overview

[Pipedream](https://pipedream.com) is a low code integration platform that makes it easy to connect APIs remarkably fast. The platform provides thousands of customizable, open source components for hundreds of apps that can be orchestrated in workflows. Developers can [contribute](CONTRIBUTING.md) to these open source components on [Github](https://github.com/pipedreamhq/pipedream):

- Create new sources and actions
- Update exisiting components (e.g., fix bugs, improve descriptions)

Once a PR is merged to the `master` branch of the `pipedreamhq/pipedream` repo, the components are automatically registered and immediately become available to the 150k+ users of the Pipedream platform. That means that the components will appear in the Pipedream marketplace and be available for users to select when building workflows.

## What are components?

Components are [Node.js modules](COMPONENT-API.md#component-structure) that run on Pipedream's serverless infrastructure. There are two types of components — **sources** and **actions**.

**Sources:**

- Emit events that can trigger Pipedream workflows (events may also be consumed outside of Pipedream via API)
- Can use any of Pipedream's built-in deduping strategies
- Can be triggered on HTTP requests, timers, cron schedules, or manually
- Store and retrieve state using the [built-in key-value store](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#db)

**Actions:**

- May be used as steps in a workflow to perform actions (e.g., get or modify data in an app) on a workflow event 
- Data returned by actions may be inspected and used in future workflow steps

**All Components:**

- May use Pipedream managed auth for 300+ apps
- Use most npm packages with no `npm install` or `package.json` required

## The Pipedream Registry

The Pipedream registry consists of sources and actions that have been curated for the community. Curated components are verified by Pipedream through the Github PR process and can be trusted, follow consistent patterns for usability, and are supported by Pipedream if issues arise. Developers submitting components for inclusion in the registry must follow the guidelines and patterns outlined in this document.

Developers may create, deploy and share components that do conform to these guidelines, but they will not be eligible to be listed in the curated registry (e.g., they may be hosted in a non-Github repo); in the future, non-curated components will also be available for users to discover via Pipedream's marketplace. If you have a developed a source you wish to submit that does not conform to these guidelines, but you believe there is value to the broader community, please [reach out in our community forum](https://pipedream.com/community)!

## Getting Started

If you're ready to build your first Pipedream component, we recommend starting with our [Quickstart Guide](QUICKSTART.md) and then reviewing the [Component API Reference](COMPONENT-API.md).

# Guidelines & Patterns

## General

### Use Case

Think about the end-user story for a source. Create sources to address specific use cases whenever possible.

> *E.g., When a user subscribes to a Github webhook to listen for “star” activity events can be generated when users star or unstar a repository. The “New Star” source filters events for only new star activity so the user doesn’t have to.*

### Webhook vs Polling Sources

Create subscription webhooks sources (vs polling sources) whenever possible. Webhook sources receive/emit events in real-time and they typically use less compute time from the user’s account. Note: In some cases, it may be appropriate to support webhook and polling sources for the same event. 

> *E.g., Calendly supports subscription webhooks for their premium users. Non-premium users are limited to the REST API. A webhook source can be created to emit new Calendly events for premium users, and a polling source can be created to support similar functionality for non-premium users.*

### Source Name

Source name should be a singular, title-cased name and should start with "New" (unless emits are not limited to new items). Name should not be slugified and should not include the app name. 
NOTE: Pipedream does not currently distinguish real-time event sources for end-users automatically. The current pattern to identify a real-time event source is to include “(Instant)” in the source name. This will change in the future.

> *E.g., “New Search Mention” or “New Submission (Instant)”*

### Source Description 

Enter a short-description that provides more detail than the name alone. Typically starts with "Emit new"

> *E.g., “Emit new Tweets that matches your search criteria”*

## Props

### Label

Use prop labels to customize the name of a prop or propDefinition (independent of the variable name in the code). The label should mirror the name users of an app are familiar with; i.e., it should mirror the equivalent label in the app’s UI. This applies to usage in labels, descriptions, etc.

> *E.g., the Twitter API property for search keywords is “q”, but but label is set to “Search Term”*

### Description

Only include a description for a prop if it helps the user understand what they need to do. Additionally, use markdown as appropriate to make the description or instructions more clear. When using markdown:

- Enclose sample input values in backticks (`)
- Link descriptive text rather than displaying a full URL using markdown syntax. 

<u>Examples</u>



> The option to select an Airtable Base is self-explanatory so includes no description:
> **![img](https://lh4.googleusercontent.com/uFqQ2o8JEDtsyQmVMlF75rXUxuChMrPQelXFqCQ_0J71z3aXH63A2Dbi0rWt3pzZ_oGBVQ3nmxjT2uVDLSSGNC5MNv14g7-N1esUJ2i0TbotxhAlxeKBcnlJvZcVWLHXerz71yAd)**
>



> The “Search Term” prop for Twitter includes a description that helps the user understand what values they can enter, with specific values highlighted using backticks and links to external content.![img](https://lh4.googleusercontent.com/-jNl4x0Dh3YrIxPttHCGyWrevIVmGCyfmlV1Zik2SyCjFJ_baAQEbsbiYrHkGI_Ybrk07ghIzeg4pkTtwdAnyxPNLG9iTLiC7tUEUwCWlWLumaA5T_FtbR7z1B_T3IYIsoGue-pr)

### Optional vs Required Props

Minimize the input fields required to submit to activate a source. Use optional fields whenever possible.

> *E.g., the Twitter search mentions source only requires that a user connect their account and enter a search term. The remaining fields are optional for users who want to filter the results, but they do not require any action to activate the source:**![img](https://lh4.googleusercontent.com/dpqhB2HDXE3M3eTdw0G7MGJsItVg7J5mlRn6RIkqV0h1cwxS5FjyG3SdLxX3DbpBXhOuaN_tDrOMMhIdJ0ZB7U64DyhHMnncAAVpVglozlA2zIZTzu5fk72KsZqQ9o_nYG2dIp-l)*

### Default Values

Use smart defaults for input fields. NOTE: the best default for a source doesn’t always map to the default recommended by the app.

> *E.g., Twitter defaults search results to an algorithm that balances recency and popularity. However, the best default for the use case on Pipedream is recency.*

### Async Options

Do not ask users to enter ID values. Use async options (with label/value definitions) so users can make selections from a drop down menu when configuring a source.

> *E.g., Todoist identifies projects by numeric IDs (e.g., 12345). The async option to select a project displays the name of the project as the label, so that’s the value the user sees when interacting with the source (e.g., “My Project”). The code referencing the selection receives the numeric ID (12345).*

### **Interface & Service Props**

In the interest of consistency, use the following naming patterns when defining interface and service props in components:

| **Scenario**      | **Recommended Prop Variable Name** |
| ----------------- | ---------------------------------- |
| $.interface.http  | `http`                             |
| $.interface.timer | `timer`                            |
| $.service.db      | `db`                               |

## App Files

### General

If an app file does not exist for your app, please contact Pipedream.

### Prop Definitions 

Whenever possible, reuse existing prop definitions. If specific elements (e.g., default value, optional/required state) for a prop definition does not fit with the current use case, those values can be overridden by redefining the values for specific keys in the source.

If a prop definition does not exist and you are adding an app-specific prop that may be reused in other/future sources, **add** it as a prop definition to the app file.

### **Methods**

Whenever possible, reuse methods defined in the app file. If you need to use an API for which a method is not defined and it may be used in future sources, define a new method in the app file.

Use the JS Docs pattern for lightweight documentation of each method in the app file. Provide a description, and define @params and @returns block tags (with default values if applicable — e.g., `[foo=bar]`). For example:

```javascript
/*
* Get the most recently liked Tweets for a user
* @params {Object} opts - An object representing the configuration options for this method
* @params {String} opts.screen_name - The user's Twitter screen name (e.g., `pipedream`)
* @params {String} opts.count [opts.count=200] - The maximum number of Tweets to return
* @params {String} opts.tweet_mode [opts.tweet_mode=extended] - Use the default of `extended` to return non-trucated Tweets
* @returns {Array} Array of most recent Tweets liked by the specified user
*/
async getLikedTweets(opts = {}) {
  const {
    screen_name,
    count = 200,
    tweet_mode = 'extended',
  } = opts
  return (await this._makeRequest({
    url: `https://api.twitter.com/1.1/favorites/list.json`,
    params: {
      screen_name,
      count,
      tweet_mode,
    }
  })).data
},
```

### Testing

Pipedream does not currently support unit tests to validate that changes to app files are backwards compatible with existing sources. Therefore, if you make changes to an app file that may impact other sources, you must currently test potentially impacted sources to confirm their functionality is not negatively affected.

## Patterns for Webhook Development

### Helper Methods

Whenever possible, create methods in the app file to manage creating and deleting webhook subscriptions.

| ** Description**                        | **Method Name** |
| --------------------------------------- | --------------- |
| Method to create a webhook subscription | `createHook()`  |
| Method to delete a webhook subscription | `deleteHook()`  |

### Storing the 3rd Party Webhook ID

After subscribing to a webhook, save the ID for the hook returned by the 3rd party service to the $.service.db for a source using the key `hookId`. This ID will be referenced when managing or deleting the webhook.

Note: some apps may not return a unique ID for the registered webhook (e.g., Jotform).

### Signature Validation

Subscription webhook components should always validate the incoming event signature if the source app supports it. 

### Shared Secrets

If the source app supports shared secrets, implement support transparent to the end user. Generate and use a GUID for the shared secret value, save it to a $.service.db key, and use the saved value to validate incoming events. 

## Other

### Deduping

Use built-in deduping strategies whenever possible (unique, greatest, last) vs developing custom deduping code. Develop custom deduping code if the existing strategies do not support the requirements for a source.

### Rate Limit Optimization

When building a polling source, cache the most recently processed ID using $.service.db whenever the API accepts a “since_id” (or equivalent). Some apps (e.g., Github) do not count requests that do not return new results against a user’s API quota.