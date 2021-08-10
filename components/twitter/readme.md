# Twitter API Integration Platform

### Pipedream is a low code, integration platform built for Node.js developers

---

Integrate Twitter + 1000s of apps, remarkably fast. Connect apps and develop, execute and maintain event-driven workflows.

**Key Features**:

- [Workflows](#workflows) - A sequence of linear steps - just Node.js code - triggered by a Twitter event
- [Twitter API Event Sources](#twitter-api-event-sources) - Open source [components](https://github.com/PipedreamHQ/pipedream/tree/master/components) that emit events from Twitter
- Serverless - No server or cloud resources to manage
- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

<a href="https://pipedream.com/new"><img src="https://i.ibb.co/n38r3KV/github.png" alt="github" border="0" height="50" /></a>

## Twitter API Event Sources

- [Search Twitter](https://pipedream.com/sources/new?app=twitter) - Triggers when a new tweet matches your search ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/search-twitter.js))
- [My Tweets](https://pipedream.com/sources/new?app=twitter) - Triggered when a you tweet a new tweet ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/my-tweets.js))
- [My Likes](https://pipedream.com/sources/new?app=twitter) - Triggered when like a tweet ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/my-liked-tweets.js))
- [New Followers](https://pipedream.com/sources/new?app=twitter) - Triggered when you get a new follower ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/new-follower-of-me.js))
- [New Followers of User](https://pipedream.com/sources/new?app=twitter) - Triggered when a specific user gets a new follower ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/new-follower-of-user.js))
- [New Trends by Geo](https://pipedream.com/sources/new?app=twitter) - Triggered when there is a new trend in a specific geo ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/new-trends-by-geo.js))
- [New Likes by User](https://pipedream.com/sources/new?app=twitter) - Triggered when there is a new like from a specific user ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/tweets-liked-by-user.js))
- [New Tweets by User](https://pipedream.com/sources/new?app=twitter) - Triggered when there is a new tweet from a specific user ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/user-tweets.js))

Event sources can also be deployed via the [Pipedream CLI](https://docs.pipedream.com/cli/reference/). Once installed, you can deploy an event source by running:

```bash
pd deploy   # prompts you to select a component and pass required options
```

## Workflows

Workflows are a sequence of linear [steps](https://docs.pipedream.com/workflows/steps) - just Node.js code - triggered by an event (via event source, HTTP endpoint, or timer). Workflows make it easy to transform data and integrate with 300+ APIs from various apps and services.

- Trigger your workflow on any [

event](https://pipedream.com/sources/new?app=twitter), a different event (e.g. [HTTP requests](https://docs.pipedream.com/workflows/steps/triggers/#http) or a [schedule](https://docs.pipedream.com/workflows/steps/triggers/#cron-scheduler)).

- Add steps to run [Node.js code](https://docs.pipedream.com/workflows/steps/code/) (using virtually any npm package) and [pre-built actions](https://docs.pipedream.com/workflows/steps/actions/).
- Steps are executed in the order they appear in your workflow.
- Data is shared between steps via [step exports](https://docs.pipedream.com/workflows/steps/#step-exports).

Workflow code is [public by default](https://docs.pipedream.com/public-workflows/) so the community can discover and [copy them](https://docs.pipedream.com/workflows/copy/). Your workflow execution and event data is private.

You can copy [this example workflow](https://pipedream.com/@tod/use-http-requests-to-trigger-a-workflow-p_6lCy5y/readme) to get started, or review some [community-developed workflows](https://pipedream.com/explore) to see what others are building.

## Other Popular API Integrations

- [Airtable](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) ([deploy](https://pipedream.com/sources/new?app=airtable))
- [AWS](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws) ([deploy](https://pipedream.com/sources/new?app=aws))
- [Dropbox](https://github.com/PipedreamHQ/pipedream/tree/master/components/dropbox) ([deploy](https://pipedream.com/sources/new?app=dropbox))
- [Github](https://github.com/PipedreamHQ/pipedream/tree/master/components/github) ([deploy](https://pipedream.com/sources/new?app=github))
- [Google Calendar](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-calendar) ([deploy](https://pipedream.com/sources/new?app=google-calendar))
- [Google Drive](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-drive) ([deploy](https://pipedream.com/sources/new?app=google-drive))
- [RSS](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) ([deploy](https://pipedream.com/sources/new?app=rss))

## Pricing

Pipedream is currently free, subject to the [limits noted below](https://docs.pipedream.com/limits/). Paid tiers for higher volumes are coming soon.

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://docs.pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or comment on your specific use case.
