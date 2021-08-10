# Zoom API Integrations

### Integrate Zoom and thousands of applications with Pipedream. Free for developers.

---

Pipedream is a serverless integration and compute platform. We provide a free, hosted platform that makes it easy to connect apps and develop, execute and maintain event-driven workflows.

**Key Features**:

- [Zoom API Event Sources](#github-api-event-sources) - Open source [components](https://github.com/PipedreamHQ/pipedream/tree/master/components) that emit events from Zoom
- [Workflows](#workflows) - A sequence of linear steps - just Node.js code - triggered by a Zoom event
- Serverless - No server or cloud resources to manage
- [Free](#pricing) - No fees for individual developers (see [limits](https://docs.pipedream.com/limits/))

<a href="https://pipedream.com/sources/new?app=zoom"><img src="https://i.ibb.co/m0bBsSL/deploy-clean.png" height="35"></a>

## Zoom API Event Sources

- [Custom Events](https://pipedream.com/sources/new?app=zoom) - Build your own event source using one or multiple events ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/custom-event.js))
- [Meeting Created](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a meeting is created where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/meeting-created.js))
- [Meeting Deleted](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a meeting is deleted where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/meeting-deleted.js))
- [Meeting Ended](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a meeting ends where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/meeting-ended.js))
- [Meeting Started](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a meeting starts where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/meeting-started.js))
- [Meeting Updated](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a meeting is updated where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/meeting-updated.js))
- [Meeting Recording Completed](https://pipedream.com/sources?action=create&key=zoom-recording-completed&utm_source=github.com&utm_medium=referral&utm_campaign=zoom) - Emits an event each time a new recording completes for a meeting or webinar where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/recording-completed.js))
- [Webinar Created](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a webinar is created where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/webinar-created.js))
- [Webinar Deleted](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a webinar is deleted where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/webinar-deleted.js))
- [Webinar Ended](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a webinar ends where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/webinar-ended.js))
- [Webinar Started](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a webinar starts where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/webinar-started.js))
- [Webinar Updated](https://pipedream.com/sources/new?app=zoom) - Emits an event each time a webinar is updated where you're the host ([code](https://github.com/PipedreamHQ/pipedream/blob/master/components/zoom/webinar-updated.js))

Event sources can also be deployed via the [Pipedream CLI](https://docs.pipedream.com/cli/reference/). Once installed, you can deploy an event source by running:

```bash
pd deploy   # prompts you to select a component and pass required options
```

## Workflows

Workflows are a sequence of linear [steps](https://docs.pipedream.com/workflows/steps) - just Node.js code - triggered by an event (via event source, HTTP endpoint, or timer). Workflows make it easy to transform data and integrate with 300+ APIs from various apps and services.

- Trigger your workflow on any [Zoom event](https://pipedream.com/sources/new?app=github), a different event (e.g. [HTTP requests](https://docs.pipedream.com/workflows/steps/triggers/#http) or a [schedule](https://docs.pipedream.com/workflows/steps/triggers/#cron-scheduler)).
- Add steps to run [Node.js code](https://docs.pipedream.com/workflows/steps/code/) (using virtually any npm package) and [pre-built actions](https://docs.pipedream.com/workflows/steps/actions/).
- Steps are executed in the order they appear in your workflow.
- Data is shared between steps via [step exports](https://docs.pipedream.com/workflows/steps/#step-exports).

Workflow code is [public by default](https://docs.pipedream.com/public-workflows/) so the community can discover and [copy them](https://docs.pipedream.com/workflows/copy/). Your workflow execution and event data is private.

You can copy [this example workflow](https://pipedream.com/@tod/use-http-requests-to-trigger-a-workflow-p_6lCy5y/readme) to get started, or review some [community-developed workflows](https://pipedream.com/explore) to see what others are building.

**Example Zoom Workflows**

- [Save Zoom recordings to Amazon S3, then delete Zoom recording](https://pipedream.com/@dylburger/save-zoom-recordings-to-amazon-s3-p_PACKJG/readme)

For a deeper introduction to Pipedream and event sources, see the [root `README` in this repo](/README.md), the [component API](/COMPONENT-API.md), or the [docs](https://docs.pipedream.com/apps/zoom/).

## Other Popular API Integrations

- [Airtable](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable) ([deploy](https://pipedream.com/sources/new?app=airtable))
- [AWS](https://github.com/PipedreamHQ/pipedream/tree/master/components/aws) ([deploy](https://pipedream.com/sources/new?app=aws))
- [Dropbox](https://github.com/PipedreamHQ/pipedream/tree/master/components/dropbox) ([deploy](https://pipedream.com/sources/new?app=dropbox))
- [Github](https://github.com/PipedreamHQ/pipedream/tree/master/components/github) ([deploy](https://pipedream.com/sources/new?app=github))
- [Google Calendar](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-calendar) ([deploy](https://pipedream.com/sources/new?app=google-calendar))
- [Google Drive](https://github.com/PipedreamHQ/pipedream/tree/master/components/google-drive) ([deploy](https://pipedream.com/sources/new?app=google-drive))
- [RSS](https://github.com/PipedreamHQ/pipedream/tree/master/components/rss) ([deploy](https://pipedream.com/sources/new?app=rss))
- [Twitter](https://github.com/PipedreamHQ/pipedream/tree/master/components/twitter) ([deploy](https://pipedream.com/sources/new?app=twitter))

## Pricing

Pipedream is currently free, subject to the [limits noted below](https://docs.pipedream.com/limits/). Paid tiers for higher volumes are coming soon.

If you exceed any of these limits, please [reach out](https://docs.pipedream.com/support/).

## Found a Bug? Have a Feature to suggest?

Before adding an issue, please search the [existing issues](https://github.com/PipedreamHQ/pipedream/issues) or [reach out to our team](https://docs.pipedream.com/support/) to see if a similar request already exists.

If an issue exists, please [add a reaction](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-conversations-on-github) or comment on your specific use case.
