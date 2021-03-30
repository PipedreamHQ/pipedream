# Purpose

This document defines guidelines and patterns developers should follow when building components for the Pipedream registry.

Developers may create, deploy and share components that do not conform to these guidelines, but they will not be eligible to be listed in the curated registry (e.g., they may be hosted in a Github repo). If you develop a component that does not adhere to these guidelines, but you believe there is value to the broader community, please [reach out in our community forum](https://pipedream.com/community). We can either provide guidance to improve compliance or evaluate if an exception is warranted.

# Overview

[Pipedream](https://pipedream.com) is a low code integration platform that makes it easy to connect APIs remarkably fast. Users can select from thousands of customizable, open source components for hundreds of apps, and orchestrate their execution in workflows. Developers can [contribute](CONTRIBUTING.md) to these open source components on [Github](https://github.com/pipedreamhq/pipedream) by:

- Creating new comonents (sources and actions)
- Updating exisiting components (e.g., fixing bugs, enhancing functionality)
- Adding or updating metadata (e.g., descriptions, labels)

Once a PR is merged to the `master` branch of the `pipedreamhq/pipedream` repo, the components are automatically registered and immediately become available to the 150k+ users of the Pipedream platform. 

## Components

Components are [Node.js modules](COMPONENT-API.md#component-structure) that run on Pipedream's serverless infrastructure. They may use Pipedream managed auth for 300+ apps and use most npm packages with no `npm install` or `package.json` required. Pipedream currently supports two types of components — sources and actions.

### Sources

- Emit events that can trigger Pipedream workflows (events may also be consumed outside of Pipedream via API)
- Emitted event data can be inspected and referenced by steps in the target workflow
- Can use any of Pipedream's built-in deduping strategies
- Can be triggered on HTTP requests, timers, cron schedules, or manually
- May store and retrieve state using the [built-in key-value store](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#db)

### Actions

- May be used as steps in workflows to perform common functions (e.g., get or modify data in an app)
- Data returned by actions may be inspected and used in future workflow steps

## Pipedream Registry

The Pipedream registry consists of sources and actions that have been curated for the community. Registered components are verified by Pipedream through the Github PR process, and:

- Can be trusted by end users
- Follow consistent patterns for usability
- Are supported by Pipedream if issues arise

Registered components also appear in the Pipedream marketplace and are listed in Pipedream's UI when building workflows.

## Prerequisites

If you're ready to build a component for the Pipedream registry, we recommend starting with our [Quickstart Guide](QUICKSTART.md) and then reviewing the [Component API Reference](COMPONENT-API.md). You will also need the following:

- A free [Pipedream](https://pipedream.com) account
- A free [Github](https://github.com) account
- Basic proficiency with Node.js or Javascript
- Pipedream [CLI](https://pipedream.com/docs/cli/reference/)

Finally, the target app must be integrated with Pipedream. You can explore all apps supported by Pipedream in the [marketplace](https://pipedream.com/explore). If your app is not listed, please [reach out](https://pipedream.com/community/c/dev/11).

## Process

To create and submit a new or updated component to the Pipedream registry:

1. Fork or branch the `pipedreamhq/pipedream` repo
2. Develop and test a new or updated component that conforms to the guidelines in the document
3. Create a PR for the Pipedream team to review and post a message in our [community forum](https://pipedream.com/community/c/dev/11)
4. Address feedback provided by Pipedream
5. Once Pipedream completes it review, the team will merge the PR to the `master` branch

Looking for ideas? Check out [sources](https://github.com/PipedreamHQ/pipedream/issues?q=is%3Aissue+is%3Aopen+%5BSOURCE%5D+in%3Atitle) and [actions](https://github.com/PipedreamHQ/pipedream/issues?q=is%3Aissue+is%3Aopen+%5BACTION%5D+in%3Atitle+) requested by the community!

# Reference Components

The following components may be used as models for developing sources and actions for Pipedream's registry.

**Sources**

| Name                                                         | App          | Type                                         |
| ------------------------------------------------------------ | ------------ | -------------------------------------------- |
| [New Card](components/trello/sources/new-card/new-card.js)   | Trello       | Webhook                                      |
| [Search Mentions](components/twitter/sources/search-mentions/search-mentions.js) | Twitter      | Polling                                      |
| [New or Modified Files](components/google_drive/sources/new-or-modified-files/new-or-modified-files.js) | Google Drive | Webhook + Polling                            |
| [New Submission](components/jotform/sources/new-submission/new-submission.js) | Jotform      | Webhook (with no unique hook ID)             |
| [New Stars](components/github/sources/new-star/new-star.js)  | Github       | Webhook (with extensive use of common files) |

**Actions**

*Coming soon*

# Guidelines & Patterns

## General

### Component Scope

Create components to address specific use cases whenever possible. For example, when a user subscribes to a Github webhook to listen for “star” activity events can be generated when users star or unstar a repository. The “New Star” source filters events for only new star activity so the user doesn’t have to.

There may be cases where it's valuable to create a generic component that provides users with broad lattitude (e.g., see the [custom webhook](components/github/sources/custom-webhook-events) event source for Github). However, as a general heuristic, we found that tightly scoped components are easier for users to understand and use.

### Required Metadata

Registry components require a unique key and version, and a friendly name and description. Action components require a `type` field to be set to `action` (sources will require a type to be set in the future).

### Folder Structure

Registry components are organized by app in the `components` directory of the `pipedreamhq/pipedream` repo. 

```
/components
	/[app_name_slug]
		/[app_name_slug].app.js
		/actions
			/[action_name_slug]
				/[action_name_slug].js
		/sources
			/[source_name_slug]
				/[source_name_slug].js
```

- The name of each app folder corresponds with the name slug for each app
- The app file should be in the root of the app folder (e.g., `../components/[app_slug]/[app_slug].app.js`)
- Components for each app are organized into `/sources` and `/actions` subfolders
- Each component should be placed in its own subfolder (with the name of the folder and the name of the `js` file equivalent to the slugified component name). For example, the path for the "Search Mentions" source for Twitter is `../components/twitter/sources/search-mentions/search-mentions.js`.

You can explore examples in the [components directory](components).

## Promoting Reusability

### App Files

App files contain components that declare the app and include prop definitions and methods that may be reused across components. App files should adhere to the following naming convention:  `[app_name_slug].app.js`. If an app file does not exist for your app, please [reach out](https://pipedream.com/community/c/dev/11).

#### Prop Definitions 

Whenever possible, reuse existing [prop definitions](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#prop-definitions-example). If specific elements (e.g., default value, optional/required state) for a prop definition does not fit with the current use case, those values can be overridden by redefining the values for specific keys in the source. If a prop definition does not exist and you are adding an app-specific prop that may be reused in future components, add it as a prop definition to the app file. Prop definitions will also be surfaced for apps the Pipedream marketplace. 

#### Methods

Whenever possible, reuse [methods](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#prop-definitions-example) defined in the app file. If you need to use an API for which a method is not defined and it may be used in future components, define a new method in the app file.

Use the [JS Docs](https://jsdoc.app/about-getting-started.html) pattern for lightweight documentation of each method in the app file. Provide a description, and define @params and @returns block tags (with default values if applicable — e.g., `[foo=bar]`). This data will both help with reusability and will be surfaced in documention for apps in the Pipedream marketplace. For example:

```javascript
/**
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

#### Testing

Pipedream does not currently support unit tests to validate that changes to app files are backwards compatible with existing components. Therefore, if you make changes to an app file that may impact other sources, you must currently test potentially impacted components to confirm their functionality is not negatively affected. We expect to support a testing framework in the future.

### Common Files (optional)

An optional pattern to improve reusability is to use a `common` module to abstract elements that are used across to multiple components. The trade-off with this approach is that it increases complexity for end-users who have the option of customizing the code for components within Pipedream. When using this approach, the general pattern is:

- The `.app.js` module contains the logic related to making the actual API calls (e.g. calling `axios.get`, encapsulate the API URL and token, etc).
- The `common.js` module contains logic and structure that is not specific to any single component. Its structure is equivalent to a component, except that it doesn't define attributes such as `version`, `dedupe`, `key`, `name`, etc (those are specific to each component). It defines the main logic/flow and relies on calling its methods (which might not be implemented by this component) to get any necessary data that it needs. In OOP terms, it would be the equivalent of a base abstract class.
- The component module of each action would inherit/extend the `common.js` component by setting additional attributes (e.g. `name`, `description`, `key`, etc) and potentially redifining any inherited methods.

See [Google Drive](components/google_drive) for an example of this pattern. When using this approach, prop definitions should still be maintainted in the app file.

## Props

### Labels

Use prop labels to customize the name of a prop or propDefinition (independent of the variable name in the code). The label should mirror the name users of an app are familiar with; i.e., it should mirror the equivalent label in the app’s UI. This applies to usage in labels, descriptions, etc. E.g., the Twitter API property for search keywords is “q”, but but label is set to “Search Term”.

### Descriptions

Include a description for a prop if it helps the user understand what they need to do. Additionally, use markdown as appropriate to improve theh clarity of the description or instructions. When using markdown:

- Enclose sample input values in backticks (`)
- Link descriptive text rather than displaying a full URL using markdown syntax. 

Examples:

- The async option to select an Airtable Base is self-explanatory so includes no description:

  ![image-20210326151557417](images/image-20210326151557417.png)

- The “Search Term” prop for Twitter includes a description that helps the user understand what values they can enter, with specific values highlighted using backticks and links to external content.
  

  ![image-20210326151706682](images/image-20210326151706682.png)

### Optional vs Required Props

Use optional props whenever possible to minimize the input fields required to use a component. 

For example, the Twitter search mentions source only requires that a user connect their account and enter a search term. The remaining fields are optional for users who want to filter the results, but they do not require any action to activate the source:


![image-20210326151930885](images/image-20210326151930885.png)

### Default Values

Provide default values whenever possible. NOTE: the best default for a source doesn’t always map to the default recommended by the app. For example, Twitter defaults search results to an algorithm that balances recency and popularity. However, the best default for the use case on Pipedream is recency.

### Async Options

Avoid asking users to enter ID values. Use async options (with label/value definitions) so users can make selections from a drop down menu. For example, Todoist identifies projects by numeric IDs (e.g., 12345). The async option to select a project displays the name of the project as the label, so that’s the value the user sees when interacting with the source (e.g., “My Project”). The code referencing the selection receives the numeric ID (12345).

Async options should also support [pagination](COMPONENT-API.md#async-options-example) (so users can navigate across multiple pages of options for long lists).

### Interface & Service Props

In the interest of consistency, use the following naming patterns when defining interface and service props in source components:

| **Scenario**      | **Recommended Prop Variable Name** |
| ----------------- | ---------------------------------- |
| $.interface.http  | `http`                             |
| $.interface.timer | `timer`                            |
| $.service.db      | `db`                               |

## Sources

### Webhook vs Polling Sources

Create subscription webhooks sources (vs polling sources) whenever possible. Webhook sources receive/emit events in real-time and typically use less compute time from the user’s account. Note: In some cases, it may be appropriate to support webhook and polling sources for the same event. For example, Calendly supports subscription webhooks for their premium users, but non-premium users are limited to the REST API. A webhook source can be created to emit new Calendly events for premium users, and a polling source can be created to support similar functionality for non-premium users.

### Source Name

Source name should be a singular, title-cased name and should start with "New" (unless emits are not limited to new items). Name should not be slugified and should not include the app name. 
NOTE: Pipedream does not currently distinguish real-time event sources for end-users automatically. The current pattern to identify a real-time event source is to include “(Instant)” in the source name. This will change in the future. E.g., “New Search Mention” or “New Submission (Instant)”.

### Source Description 

Enter a short-description that provides more detail than the name alone. Typically starts with "Emit new". E.g., “Emit new Tweets that matches your search criteria”.

### Emit a Summary

Always [emit a summary](COMPONENT-API.md#emit) for each event. For example, the summary for each new Tweet emitted by the Search Mentions source is the content of the Tweet itself.

If no sensible summary can be identified, submit the event payload in string format as the summary.

### Deduping

Use built-in deduping strategies whenever possible (unique, greatest, last) vs developing custom deduping code. Develop custom deduping code if the existing strategies do not support the requirements for a source.

### Polling Sources 

#### Emit Events on First Run

Polling sources should emit events on the first run. This helps users to know their source works when they activate it. This also provides users with events they can immediately use to support workflow development.

#### Rate Limit Optimization

When building a polling source, cache the most recently processed ID using $.service.db whenever the API accepts a “since_id” (or equivalent). Some apps (e.g., Github) do not count requests that do not return new results against a user’s API quota.

### Webhook Sources

#### Helper Methods

Whenever possible, create methods in the app file to manage creating and deleting webhook subscriptions.

| **Description**                         | **Method Name** |
| --------------------------------------- | --------------- |
| Method to create a webhook subscription | `createHook()`  |
| Method to delete a webhook subscription | `deleteHook()`  |

#### Storing the 3rd Party Webhook ID

After subscribing to a webhook, save the ID for the hook returned by the 3rd party service to the $.service.db for a source using the key `hookId`. This ID will be referenced when managing or deleting the webhook.

Note: some apps may not return a unique ID for the registered webhook (e.g., Jotform).

#### Signature Validation

Subscription webhook components should always validate the incoming event signature if the source app supports it. 

#### Shared Secrets

If the source app supports shared secrets, implement support transparent to the end user. Generate and use a GUID for the shared secret value, save it to a $.service.db key, and use the saved value to validate incoming events. 

## Actions

Coming soon.