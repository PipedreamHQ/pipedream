---
prev: false
next: false
---

# Overview

## What is Pipedream?

Pipedream makes it easy to connect APIs, remarkably fast so you can: 

- Stop writing boilerplate code, struggling with authentication and managing infrastructure
- Start connecting APIs with code-level control when you need it — and no code when you don't

Watch a demo (4 min):

<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1612919959/homepage/workflow-demo_ks64up.png">

## Getting Started

If you're new to Pipedream, we recommend starting with our quickstart to learn the basic patterns for workflow development including how to:

- Trigger workflows on HTTP requests, schedules and app events (including new items in an RSS feed and new mentions on Twitter)
- Return a custom response from your workflow on HTTP requests
- Use npm packages and export data from Node.js code steps
- Pass data between workflow steps
- Use actions to send yourself an email, add data to Google Sheets and send a message to Slack

## Advanced Features

## Contributing

blah


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
