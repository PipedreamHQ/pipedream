# Sources

Sources operate primarily as workflow triggers. When you add a new [trigger](/workflows/steps/triggers/) to your workflow, it's powered by a source of data, which could be an API webhook or a timer.

You can think of an source as the _trigger_ to start your workflow with some new data; whereas actions on a workflow _act_ on this new data passed from a source.

<div>
<img alt="How sources appear in the workflow builder as triggers" width="600px" src="./images/app-based-trigger.png">
</div>

Sources define how data is piped to your workflows, whether it be from an API request triggered by a timer or an incoming webhook from a third party API.

Sources are separate from actions and workflows. This is because a single source can trigger more than workflow.

You can view your sources at [https://pipedream.com/sources](https://pipedream.com/sources). Here, you'll see the events a specific source has emitted, as well as the logs and configuration for that source.

[[toc]]

## How do sources work?

Sources collect data from apps or service like Github, Twitter, and Google Calendar, then **emit** this data as individual events. These events trigger linked workflows, and [can be retrieved using the API or SSE interfaces](#consuming-events-from-sources).

If the service supports webhooks or another mechanism for real-time data delivery, the source uses it. For example, Google Sheets supports webhooks, which allows Google Sheets sources to emit updates instantly.

If a service doesn't support real-time event delivery, Pipedream polls the API for updates every few minutes, emitting events as the API produces them. For example, Airtable doesn't support webhooks, so we poll their API for new records added to a table.

Examples of sources:

* New subscription on a Stripe account
* New rows added to a Google Spreadsheet
* New webhook from an application 

## Creating sources

You can create sources from the Pipedream UI or CLI.

### Creating a source from the UI

Visit [https://pipedream.com/sources](https://pipedream.com/sources) and click the **New +** button at the top right to create a new source. You'll see a list of sources tied to apps (like Twitter and Github) and generic interfaces (like HTTP). Select your source, and you'll be asked to connect any necessary accounts (for example, the Twitter source requires you authorize Pipedream access to your Twitter account), and enter the values for any configuration settings tied to the source.

Once you've created a source, you can use it to trigger [Pipedream workflows](/workflows/) or [consume its events](#consuming-events-from-sources) using Pipedream's APIs.

### Creating a source from the CLI

[Download the CLI](/cli/install/) and run:

```bash
pd deploy your_source.js
```

This will bring up an interactive menu prompting you to select a source. Once selected, you'll be asked to connect any necessary accounts (for example, the Twitter source requires you authorize Pipedream access to your Twitter account), and enter the values for any configuration settings tied to the source.

Once you've created a source, you can use it to trigger [Pipedream workflows](/workflows/) or [consume its events](#consuming-events-from-sources) using Pipedream's APIs.

## Consuming events from sources

You can view the events for a source in the sources UI, under the **Events** section of that source.

You can also trigger a [Pipedream workflow](/workflows/) every time your source emits a new event. This lets you run workflows for every new tweet, every new item in an RSS feed, and more.

Finally, you can consume events programmatically, outside the Pipedream platform, in a few different ways:

- In real-time, using the [SSE stream](/api/sse/) linked to your source
- In real-time, via the CLI's [`pd events` command](/api/sse/#subscribe-to-new-events-using-the-pipedream-cli)
- In batch, using the [REST API](#rest-api)

## Example: HTTP source

The simplest event source is an **HTTP source**.

When you create an HTTP source:

- You get a unique HTTP endpoint that you can send any HTTP request to.
- You can view the details of any HTTP request sent to your endpoint: its payload, headers, and more.
- You can add actions that are executed after the source is triggered by an HTTP request

HTTP sources are essentially [request bins](https://requestbin.com) that can be extended off of with composible actions.

HTTP sources are a good example of how you can turn an event stream into an API: the HTTP requests are the **event stream**, generated from your application, client browsers, webhooks, etc. Then, you can retrieve HTTP requests via Pipedream's [**REST API**](/api/rest/), or stream them directly to other apps using the [SSE interface](/api/sse/).

[**See the Github quickstart for more information on HTTP event sources**](https://github.com/PipedreamHQ/pipedream/tree/master/components/http#quickstart).

## Example: Cron jobs

You can also use event sources to run any Node code on a schedule, allowing you to poll a service or API for data and emit that data as an event. The emitted events can trigger Pipedream workflows, and can be retrieved using Pipedream's [**REST API**](/api/rest/) or [SSE interface](/api/sse/).

## Example: RSS

You can run an event source that polls an RSS for new items and emits them in real time as formatted JSON.

[**Create an RSS event source here**](https://pipedream.com/sources/new?app=rss&key=rss-new-item-in-feed).

## Publishing a new event source, or modifying an existing source

Anyone can create an event source or edit an existing one. The code for all event sources is public, and kept in the [`PipedreamHQ/pipedream` repo](https://github.com/PipedreamHQ/pipedream). [Read this quickstart](/components/quickstart/nodejs/sources/) and see the [event source API docs](/components/api/) to learn more about the source development process.

You can chat about source development with the Pipedream team in the `#contribute` channel of our [public Slack](https://join.slack.com/t/pipedream-users/shared_invite/zt-ernlymsn-UHfPg~Dfp08uGkAd8dpkww), and in the `#dev` topic in the [Pipedream community](https://pipedream.com/community/c/dev/11).

## Limits

Event sources are subject to the [same limits as Pipedream workflows](/limits/).

<Footer />
