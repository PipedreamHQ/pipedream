Component documentation is intended for a technical audience (including those interested in learning how to author and edit components). 

**If you're new to Pipedream, we recommend watching this [5 minute demo](https://www.youtube.com/watch?v=hJ-KRbp6EO8) and signing up for a [free account](https://pipedream.com/auth/signup) first.** 

# Overview

Components are [Node.js modules](COMPONENT-API.md#component-structure) that run on Pipedream's serverless infrastructure. They may use Pipedream managed auth for [300+ apps](https://pipedream.com/explore) (for both OAuth and key-based APIs) and [use most npm packages](COMPONENT-API.md#using-npm-packages) with no `npm install` or `package.json` required. 

Pipedream currently supports two types of components — [sources](#sources) and [actions](#actions). You may explore curated components for popular apps in the [Pipedream Marketplace](https://pipedream.com/explore) or you can author and share your own.

## Sources

Sources are specialized components that may be instantiated and emit events. They are most commonly used as workflow triggers. Events emitted by sources may also be consumed outside of Pipedream (via API or CLI) or simply inspected.

**Capabilities**

- Emit events that can trigger Pipedream [workflows](https://pipedream.com/docs/workflows/) (events may also be consumed outside of Pipedream via [API](https://pipedream.com/docs/api/overview/))
- Emitted event data can be inspected and referenced by [steps](https://pipedream.com/docs/workflows/steps/) in the target workflow
- Can use any of Pipedream's built-in [deduping strategies](COMPONENT-API.md#dedupe-strategies)
- Can be [triggered](COMPONENT-API.md#interface-props) on HTTP requests, timers, cron schedules, or manually
- May store and retrieve state using the [built-in key-value store](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#db) 

**Example**

The Search Mentions source for Twitter is a component that will regularly poll the Twitter API for Tweets matching a search query and it will emit new Tweets as events. The component abstracts the need to understand the Twitter API and how to dedupe the results. 

## Actions

Actions are components that may be used as the step of a workflow. Unlike sources, actions cannot run on their own (outside of a workflow).

**Capabilities**

- May be used as [steps]((https://pipedream.com/docs/workflows/steps/)) in [workflows](https://pipedream.com/docs/workflows/) to perform common functions (e.g., get or modify data in an app)
- [Data returned by actions](https://pipedream.com/docs/workflows/steps/#step-exports) may be inspected and used in future workflow steps

**Example**

TBC

# Use

All components may be instantiated or added to workflows via Pipedream's UI. Sources may also optionally be instantiated or consumed via CLI or API.

Instantiated components may be edited via the Pipedream UI. This capability allows power users to scaffold sources and actions and customize the code to their needs.

**Sources**
To customize code for a source, load your source in the Pipedream UI and navigate to the **Config** tab.

**Actions**
Coming soon!*

# Develop

Components may currently be developed locally using your preferred code editor and deployed using Pipedream's [CLI](https://docs.pipedream.com/cli/reference/#pd-deploy). You may develop sources and actions for your own private use (and maintain your code in your own Github repo) or you can share your components publicly. 

## Prerequisites

- A free [Pipedream](https://pipedream.com) account 
- A free [Github](https://github.com) account
- Basic proficiency with Node.js or Javascript
- Pipedream [CLI](https://pipedream.com/docs/cli/reference/)

Finally, the target app must be integrated with Pipedream. You can explore all apps supported by Pipedream in the [marketplace](https://pipedream.com/explore). If your app is not listed, please [create a Github issue](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=app%2C+enhancement&template=app---service-integration.md&title=%5BAPP%5D) to request it and [reach out](https://pipedream.com/community/c/dev/11) to our team to let us know that you're blocked on source or action development.

## Quickstart Guides

- [Sources](QUICKSTART.md) 
- Actions (coming soon)

## Component API Reference

After getting familiar with source/action development using the quickstart guides, check out [the Component API Reference](COMPONENT-API.md) and [examples on Github](https://github.com/pipedreamhq/pipedream/components) to learn more.

# Share

Contribute to the Pipedream community by publishing and sharing new components, and contributing to the maintenance of existing ones.

## Verified Components

Pipedream maintains an open source registry of components (sources and actions) that have been curated for the community. Registered components are verified by Pipedream through the [Github PR process](#process) and:

- Can be trusted by end users
- Follow consistent patterns for usability
- Are supported by Pipedream if issues arise

Registered components also appear in the Pipedream marketplace and are listed in Pipedream's UI when building workflows.

## Community Components

Developers may create, deploy and share [components](#components) that do not conform to these guidelines, but they will not be eligible to be listed in the curated registry (e.g., they may be hosted in a Github repo). If you develop a component that does not adhere to these guidelines, but you believe there is value to the broader community, please [reach out in our community forum](https://pipedream.com/community/c/dev/11).

