---
prev: false
next: false
---

# Overview

## What is Pipedream?

Pipedream is a production-scale serverless platform to connect APIs, remarkably fast. 

1. Connect OAuth and key-based API accounts in seconds.
2. Use connected accounts in Node.js code steps or no-code building blocks.
3. Build and run workflows triggered on HTTP requests, schedules, app events and more.

<!--Pipedream also makes it easy to test and validate your integrations, scaffold API requests for any app, maintain state between executions, manage execution rate and concurrency and more. -->

Watch a 4-minute demo or review our [quickstart guide](/quickstart/):

<!--With Pipedream, you can stop writing boilerplate code, struggling with authentication and managing infrastructure, and start connecting APIs with code-level control when you need it — and no code when you don't. -->

<!--Pipedream is a low code integration platform for developers. We make it easy to connect APIs remarkably fast so you can stop writing boilerplate code, struggling with authentication and managing infrastructure, and start connecting APIs with code-level control when you need it — and no code when you don't.-->

<video controls poster="./images/demo-poster.png" width="100%">
  <source src="https://res.cloudinary.com/pipedreamin/video/upload/v1612307285/homepage/Using_Event_Sources_and_Workflows__Analyze_Twitter_Sentiment_in_Real-Time_and_Save_to_Google_Sheets_ehy2ho.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

<!--![image-20210520194929461](./image-20210520194929461.png)-->

<!--img src="https://res.cloudinary.com/pipedreamin/image/upload/v1612919959/homepage/workflow-demo_ks64up.png"-->

<!--
Trusted by developers from startups to Fortune 500 companies:

![logos](https://res.cloudinary.com/pipedreamin/image/upload/v1612919944/homepage/logos_kcbviz.png)

## How Pipedream Works

Pipedream provides a serverless platform to build and run workflows that connect APIs:

- Connect your OAuth and key-based API accounts in seconds
- Use connected accounts to auth APIs in code steps or in "no code" building blocks
- Compose steps into workflows and trigger on HTTP requests, schedules or app events

Pipedream also provides easy to use services to solve common serverless and integration challenges including state management, execution rate and concurrency controls, large file support (up to 5TB) and more! 

Watch a demo (4 mins):

-->

## Is Pipedream for me?

We make it easy to connect APIs with code-level control when you need it — and no code when you don't. If you and your team want to stop writing boilerplate code, struggling with authentication and managing infrastructure for API integrations, then Pipedream is for you. 

Developers with a working knowledge of Node.js or Javascript will get the most value from Pipedream (Python, Typescript. and GitHub integration are coming soon).

<!--
Pipedream is trusted by 150k+ developers from startups to Fortune 500 companies:

![logos](https://res.cloudinary.com/pipedreamin/image/upload/v1612919944/homepage/logos_kcbviz.png)
-->

## Getting Started

Sign up for a [free account (no credit card required)](https://pipedream.com/auth/signup) and complete our [quickstart guide](/quickstart/) to learn the basic patterns for workflow development:

- Trigger workflows on HTTP requests, schedules and app events
- Return a custom response from your workflow on HTTP requests 
- Use connected accounts in actions and code steps
- Pass data between code steps and no code actions
- Use npm packages in Node.js code steps
- Scaffold an API request in Node.js
- End workflow execution early

<!--
<p style="text-align:center;">
<a href="/quickstart/hello-world/"><img src="./quickstart/get-started.png"></a>
</p>
-->
Pipedream offers a generous free tier (no credit card required) so you can test out the platform and use it for personal projects with no risk or committment. As your needs grow, it's easy to upgrade to paid plans to run without limits for individuals, teams (in alpha) and enterprises.

## Use Cases

Pipdream supports use cases from protototype to production and is trusted by 150k+ developers from startups to Fortune 500 companies:

![logos](https://res.cloudinary.com/pipedreamin/image/upload/v1612919944/homepage/logos_kcbviz.png)

The platform processes billions of events and is built and [priced](https://pipedream.com/pricing/) for use at scale. [Our team](https://pipedream.com/about) has built internet scale applications and managed data pipelines in excess of 10 million events per second (EPS) at startups and high-growth environments like BrightRoll, Yahoo!, Affirm and Instacart. 

Our [community](https://pipedream.com/community) uses Pipedream for a wide variety of use cases including:

- Connecting SaaS apps
- General API orchestration and automation
- Database automations (learn about [connecting to resources behind a firewall](/workflows/steps/code/nodejs/http-requests/#use-an-http-proxy-to-proxy-requests-through-another-host))
- Custom notifications and alerting
- Mobile and JAMstack backends
- Rate limiting, request smoothing
- Event queuing and concurrency management
- Webhook inspection and routing
- Prototyping and demos

## Open Source

Pipedream maintains an [open source component registry](https://github.com/pipedreamhq/pipedream/) on GitHub. Reuse these components in workflows so you don't need to write boilerplate code for common API integrations, or use existing components as scaffolding to customize and publish your own. You can also [create a PR contribute new or enhanced components](/components/guidelines/#process) via GitHub.

## Contributing

We hope is that by providing a generous free tier, you will not only get value from Pipedream, but you will give back to help us improve the product for the entire community and grow the platform by:

- [Contributing](/components/guidelines/) open source components to our [registry](https://github.com/pipedreamhq/pipedream.) or sharing via your own Github repo
- Asking and answering questions in our [public community](https://pipedream.com/community/)
- [Reporting bugs](https://pipedream.com/community/c/bugs/9) and [requesting features](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=%5BFEATURE%5D+) that help us build a better product
- Following us on [Twitter](https://twitter.com/pipedream), starring our [Github repo](https://github.com/PipedreamHQ/pipedream) and subscribing to our [YouTube channel](https://www.youtube.com/c/pipedreamhq)
- Recommending us to your friends and colleagues

Learn about [all the ways you can contribute](https://pipedream.com/contributing).

## Getting Help

If you have any questions or feedback, please [reach out in our community forum](https://pipedream.com/community).



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