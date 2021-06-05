# Strava

Pipedream provides a serverless programming platform for building event-driven [workflows](/workflows/) that integrate apps. Pipedream comes with [prebuilt actions](/workflows/steps/actions/) for interacting with the Strava API, and allows you to listen for Strava events in your account and trigger code when they happen.

Pipedream is fully programmable - you can write [any Node.js code](/workflows/steps/code/) to control your workflows - but also fully-managed: Pipedream runs your code, so you don't have to manage any infrastructure and can focus on your workflow's logic.

[[toc]]

## Overview

**Pipedream [workflows](/workflows/) allow you to run any Node.js code that connects to the Strava API**. Just [create a new workflow](https://pipedream.com/new), then add prebuilt Strava [actions](/workflows/steps/actions/) or [write your own Node code](/workflows/steps/code/). These workflows can be triggered by HTTP requests, timers, email, or on any app-based event (new tweets, a Github PR, Zoom events, etc).

**Pipedream [**event sources**](/event-sources/) expose real-time event streams for [Strava events](#strava-events-event-sources)** - just connect your Strava account, and get an event stream. Event sources can trigger workflows, running custom code each time an event occurs in Strava. For example, to run a workflow each time you complete a new activity, you can create an **Activity Created** source. This source emits an event when you add a new activity to Strava, which can trigger a workflow that [sends the activity data to Slack](https://pipedream.com/@dylan/send-new-strava-activities-to-slack-p_5VCBKZ/edit), [stores it in a Google sheet](https://pipedream.com/@dylan/store-new-strava-activity-data-in-a-google-spreadsheet-p_D1CvkG/edit), or anything else you'd like.

You can also subscribe to a [private SSE stream](/api/sse/) that lets you listen for these events **in your own application**, in real time. This allows you to use Pipedream to host the event source, which can trigger existing code in your own infrastructure (vs. a Pipedream workflow).

## Strava Events & Event Sources

Pipedream exposes event sources for each of the following events:

|                                Event (click to create source)                                 |         Description          |
| :-------------------------------------------------------------------------------------------: | :--------------------------: |
| [`activity.created`](https://pipedream.com/sources?action=create&key=strava-activity-created) |      New activity added      |
| [`activity.updated`](https://pipedream.com/sources?action=create&key=strava-activity-updated) | Activity title, type changed |
| [`activity.deleted`](https://pipedream.com/sources?action=create&key=strava-activity-deleted) |       Activity deleted       |

You can also create a [Custom Strava Events](https://pipedream.com/sources?action=create&key=strava-custom-events) source that will allow you to listen for any combination of the events above. For example, if you wanted to run a Pipedream workflow every time an event was added _or_ updated, you can create a Custom Events source that will emit both events.

You can review the code for any of these event sources [on the `PipedreamHQ/pipedream` Github repo](https://github.com/PipedreamHQ/pipedream/tree/master/components/strava). The Pipedream team welcomes PRs and suggested improvements.

## Strava Workflows

Curious what you can do with Strava event sources, or need some inspiration? Copy these workflows:

- [Send new Strava activities to Slack](https://pipedream.com/@dylan/send-new-strava-activities-to-slack-p_5VCBKZ/edit)
- [Store new Strava activity data in a Google spreadsheet](https://pipedream.com/@dylan/store-new-strava-activities-in-a-google-spreadsheet-p_D1CvkG/edit)

## Common Issues

If you're having an issue you can't solve with these docs, [get support here](https://docs.pipedream.com/support/).

### Event Delay

The Pipedream team has observed intermittent delays between the time an event occurs in Strava and the time it's received by Pipedream. This delay can last 15 minutes or more. If you trigger a new event in Strava and are not seeing the event emitted by your Pipedream source, wait for at least 30 minutes. 

## Removing Pipedream's access to your Strava account

You can revoke Pipedream's access to your Strava account by visiting your [Strava Settings](https://www.strava.com/settings/apps).

As soon as you do, any Pipedream workflows that connect to Strava will immediately fail to work.

Once you've revoked Pipedream's access to your account from Strava, you can delete any Strava connected accounts in [your list of Pipedream Accounts](https://pipedream.com/accounts), as well.

## Strava Developer Docs

- [API Docs](http://developers.strava.com/)
- [Webhook Events API](https://developers.strava.com/docs/webhooks/)
- [API Agreement](https://www.strava.com/legal/api)

<Footer />
