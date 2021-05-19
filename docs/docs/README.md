---
prev: false
next: false
---

# Overview

## What is Pipedream?

Pipedream is a low code integration platform for developers. We make it easy to connect APIs, remarkably fast so you can: 

- Stop writing boilerplate code, struggling with authentication and managing infrastructure
- Start connecting APIs with code-level control when you need it — and no code when you don't

Watch a demo (4 min):

<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1612919959/homepage/workflow-demo_ks64up.png">

## How Pipedream Works

Pipedream provides a serverless runtime environment where you can run workflows to connect APIs:

- Workflows are composed of a sequence of linear [**steps**](/docs/workflows/steps).
- Add steps to run Node.js [code](/workflows/steps/code/) (and use any [`npm`](/workflows/steps/code/#using-npm-packages) package) or use [pre-built, open source actions](/workflows/steps/actions/).
- Workflows can be triggered on HTTP requests, schedules, events from hundreds of apps and more.

Pipedream also provides easy to use services to authenticate hundreds of APIs, maintain state between workflow invocations, activate event queues to manage the rate and concurrency of workflow executions, work with large files up to 5TB and more!

## Getting Started

We recommend starting with our quickstart to learn the basic patterns for developing Pipedream workflows including how to:

- Trigger workflows on HTTP requests, schedules and app events
- Return a custom response from your workflow on HTTP requests
- Use npm packages and export data from Node.js code steps
- Pass data between workflow steps
- Use actions to send yourself an email, add data to Google Sheets and send a message to Slack
- Write custom code with Pipedream managed auth to authenticate any API request

## Integrations

Hundreds of apps are already integrated with Pipedream. Explore APIs, triggers, actions and more in the [marketplace](https://pipedream.com/explore).

## Open Source on Github

Contribute to Pipedream's registry of open source components  by:

- Creating new comonents (sources and actions)
- Updating exisiting components (e.g., fixing bugs, enhancing functionality)
- Adding or updating metadata (e.g., descriptions, labels)


## Community

Our hope is that by providing a generous free tier, you will not only get value from Pipedream, but you will give back to improve the value of the product for the entire community.

- Follow us on Twitter, star our Github repo and subscribe to our YouTube channel
- Recommend us to your friends and colleagues
- Ask and answer questions in our public community
- Report bugs and request features that will help us build a better product
- Share your workflows

[Learn more](https://pipedream.com/contributing)

## Getting Help

If you have any questions, feedback, or ideas for how we could improve the platform, please [reach out in our community forum](https://pipedream.com/community).



<!--
### Benefits

### No servers or infrastructure to manage

In other tools, you typically have to setup infrastructure to process events — typically you setup an HTTP endpoint, then run a script on a container, or have to manage a serverless function. This takes time to write and maintain.

Pipedream is purpose-built for running workflows on event data, so we take care of the infrastructure and boilerplate configuration for you. **Pipedream lets you focus on _what_ you want done, and we take care of _how_ to do it for you.**

### Run any Node code

Write Node.js [code](/workflows/steps/code/) and require npm packages. `event` contains your trigger event data. Exported step data, along with standard output, appears under each code step for inline observability.

### Iterate quickly with inline observability, automatic versioning and instant deploys

See events and debug execution details in real time. Output, errors, timing, and return values appear below each step. Time travel to previous versions of code, at the time the event occurred.

### Connect to APIs without writing any code

[Actions](/workflows/steps/actions/) are pre-defined code steps built by the Pipedream community. Send a message to Slack or Discord, store data in S3 or Snowflake, and more, all without writing any code.

### Auth made easy

Auth apps once, connect to those apps in any workflow. Pipedream supports OAuth and key-based auth, and handles the OAuth flow and token refresh for you. Just link accounts to steps and reference the relevant auth info in code.

### It's free

The Pipedream team believes anyone should be able to run simple, low-volume workflows at no cost. **Pipedream offers a [generous free tier](/pricing/#developer-tier)**. You can run sources and workflows for free within the limits of the free tier. If you hit these limits, you can upgrade to one of our [paid tiers](/pricing/#professional-tier).
-->