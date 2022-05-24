# REST API

[[toc]]

## Overview

Use the REST API to create and manage sources, workflows and source events.
Workflow development and management is not currently supported via the API. 

## Base URL

The base URL for all requests is **{{$site.themeConfig.API_BASE_URL}}** .

## Authentication

You authenticate to the REST API using your [Pipedream API
key](/api/auth/#pipedream-api-key). When you make API requests, pass an
`Authorization` header of the following format:

```
Authorization: Bearer <api key>
```

For example, here's how you can use `cURL` to fetch profile information for the
authenticated user:

```shell
curl 'https://api.pipedream.com/v1/users/me' \
  -H 'Authorization: Bearer <api_key>'
```

Learn more about [API authentication](/api/auth/)

## Required headers

The `Authorization` header is required on all endpoints for authentication.

`POST` or `PUT` requests that accept JSON payloads also require a `Content-Type`
header set to `application/json`. For example:

```shell
curl https://api.pipedream.com/v1/components \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js"}'
```

## Common Parameters

The following parameters can be passed to any endpoint. They can be included as
query string params for `GET` requests, or in the body of the payload of `POST`
requests.

---

`include` **string**

The fields in the API response you'd like to include (defaults to all fields).
Pass as a string of comma-separated values:

`comma,separated,fields,to,include`

---

`exclude` **string**

The fields in the API response you'd like to _exclude_ (defaults to none,
including all fields). Pass as a string of comma-separated values:

`comma,separated,fields,to,include`

---

`org_id` **string**

Some endpoints require you to specify [the org ID](/orgs/#finding-your-organization-s-id) you want the operation to take effect in. For example, if you're creating a new event source in a specific org, you'll want to pass the org ID in the `org_id` query string parameter.

[Find your org's ID here](/orgs/#finding-your-organization-s-id).

## Working with resources owned by an organization

If you're interacting with resources owned by an [organization](/orgs/), you may need to specify the org ID as a part of the request's query string parameter or route:

- When fetching specific resources (for example, when you [retrieve events for a specific source](#get-source-events)), you should not need to pass your org's ID. If your user is a part of the org, you should have access to that resource, and the API will return the details of the resource.
- When _creating_ new resources, you'll need to specify the `org_id` where you want the resource to live as a query string parameter (`?org_id=o_abc123`). Read more about the `org_id` parameter in the [Common Parameters section](#common-parameters).
- When _listing_ resources, use [the org-specific endpoints here](#organizations).

## Pagination

Most API endpoints below support pagination, **with a default page size of 10
items**. You can vary the size of pages, and set a `before` or `after` cursor on
the results, using the following parameters. They can be included as query
string params for `GET` requests, or in the body of the payload of `POST`
requests.

---

`limit` **integer**

The number of items to return in the requested page of results.

- Default: 10
- Min: 1
- Max: 100

---

`after` **string**

A cursor, specifying you'd like to retrieve items _after_ this cursor.

Cursor strings are returned with all paginated responses.

---

`before` **string**

A cursor, specifying you'd like to retrieve items _before_ this cursor.

Cursor strings are returned with all paginated responses.

---

### Example Paginated Request

This request fetches a page of 5 sources in the authenticated account, after a
specific cursor (returned with a previous request):

```shell
curl https://api.pipedream.com/v1/users/me/sources\?limit\=3\&after\=ZGNfSzB1QWVl \
  -H "Authorization: Bearer <api key>"
```

### Example Paginated Response

The response from the request above will have a shape that looks like:

```json
{
  "page_info": {
    "total_count": 3,
    "count": 3,
    "start_cursor": "ZGNfSzB1QWVl",
    "end_cursor": "ZGNfclhhdTZv"
  },
  "data": [
    {
      "id": "dc_5YGuMo"
    },
    {
      "id": "dc_5v3unr"
    },
    {
      "id": "dc_rXau6o"
    }
  ]
}
```

## Errors

Pipedream uses conventional HTTP response codes to indicate the success or
failure of an API request. Codes in the **2xx** range indicate success. Codes in
the **4xx** range indicate an error that failed (e.g., a required parameter was
omitted). Codes in the **5xx** range indicate an error with Pipedream’s server.

## Components

Components are objects that represent the code for an [event source](#sources).

### Create a component

---

Before you can create a source using the REST API, you must first create a
**component** - the code for the source.

This route returns the components `id`, `code`, `configurable_props`, and other
metadata you'll need to [deploy a source](#create-a-source) from this component.

#### Endpoint

```
POST /components
```

#### Parameters

---

`component_code` **string** (_optional_)

The full code for a [Pipedream component](/components/api/).

---

`component_url` **string** (_optional_)

A reference to the URL where the component is hosted.

For example, to create an RSS component, pass
`https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js`.

---

One of `component_code` _or_ `component_url` is required. If both are present,
`component_code` is preferred and `component_url` will be used only as metadata
to identify the location of the code.

#### Example Request

Here's an example of how to create an RSS component from a Github URL:

```shell
curl https://api.pipedream.com/v1/components \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js"}'
```

#### Example Response

```json
{
  "data": {
    "id": "sc_JDi8EB",
    "code": "component code here",
    "code_hash": "685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1",
    "name": "rss",
    "version": "0.0.1",
    "configurable_props": [
      {
        "name": "url",
        "type": "string",
        "label": "Feed URL",
        "description": "Enter the URL for any public RSS feed."
      },
      {
        "name": "timer",
        "type": "$.interface.timer",
        "default": {
          "intervalSeconds": 900
        }
      }
    ],
    "created_at": 1588866900,
    "updated_at": 1588866900
  }
}
```

### Get a component

Retrieve a component saved or published in your account using its saved
component ID **or** key.

This endpoint returns the component's metadata and configurable props.

#### Endpoint

```
GET /components/{key|id}
```

#### Parameters

---

`key` **string**

The component key (identified by the `key` property within the component's
source code) you'd like to fetch metadata for (example: `my-component`)

**or**

`id` **string**

The saved component ID you'd like to fetch metadata for (example: `sc_JDi8EB`)

---

#### Example Request

```shell
curl https://api.pipedream.com/v1/components/my-component \
  -H "Authorization: Bearer <api_key>"
```

#### Example Response

```json
{
  "data": {
    "id": "sc_JDi8EB",
    "code": "component code here",
    "code_hash": "685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1",
    "name": "rss",
    "version": "0.0.1",
    "configurable_props": [
      {
        "name": "url",
        "type": "string",
        "label": "Feed URL",
        "description": "Enter the URL for any public RSS feed."
      },
      {
        "name": "timer",
        "type": "$.interface.timer",
        "default": {
          "intervalSeconds": 900
        }
      }
    ],
    "created_at": 1588866900,
    "updated_at": 1588866900
  }
}
```

### Get a component from the global registry

Pipedream operates a global registry of all public components (for example, for
apps like Github, Google Calendar, and more). This endpoint returns the same
data as the endpoint for [retrieving metadata on a component you
own](#get-a-component), but allows you to fetch data for any globally-published
component.

#### Endpoint

```
GET /components/registry/{key}
```

#### Parameters

---

`key` **string**

The component key (identified by the `key` property within the component's
source code) you'd like to fetch metadata for (example: `my-component`)

---

#### Example Request

```shell
curl https://api.pipedream.com/v1/components/registry/github-new-repository \
  -H "Authorization: Bearer <api_key>"
```

#### Example Response

```json
{
  "data": {
    "id": "sc_JDi8EB",
    "code": "component code here",
    "code_hash": "685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1",
    "name": "rss",
    "version": "0.0.1",
    "configurable_props": [
      {
        "name": "url",
        "type": "string",
        "label": "Feed URL",
        "description": "Enter the URL for any public RSS feed."
      },
      {
        "name": "timer",
        "type": "$.interface.timer",
        "default": {
          "intervalSeconds": 900
        }
      }
    ],
    "created_at": 1588866900,
    "updated_at": 1588866900
  }
}
```

## Events

### Get Source Events

---

Retrieve up to the last 100 events emitted by a source.

#### Endpoint

```
GET /sources/{id}/event_summaries
```

#### Notes and Examples

The event data for events larger than `1KB` may get truncated in the response.
If you're processing larger events, and need to see the full event data, pass
`?expand=event`:

```
GET /sources/{id}/event_summaries?expand=event
```

Pass `?limit=N` to retrieve the last **N** events:

```
GET /sources/{id}/event_summaries?limit=10
```

### Delete source events

---

Deletes all events, or a specific set of events, tied to a source.

By default, making a `DELETE` request to this endpoint deletes **all** events
associated with a source. To delete a specific event, or a range of events, you
can use the `start_id` and `end_id` parameters.

These IDs can be retrieved by using the [`GET /sources/{id}/event_summaries`
endpoint](/api/rest/#get-source-events), and are tied to the timestamp at which
the event was emitted — e.g. `1589486981597-0`. They are therefore naturally
ordered by time.

#### Endpoint

```
DELETE /sources/{id}/events
```

#### Parameters

---

`start_id` **string**

The event ID from which you'd like to start deleting events.

If `start_id` is passed without `end_id`, the request will delete all events
starting with and including this event ID. For example, if your source has 3
events:

- `1589486981597-0`
- `1589486981598-0`
- `1589486981599-0`

and you issue a `DELETE` request like so:

```shell
curl -X DELETE \
  -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_abc123/events?start_id=1589486981598-0"
```

The request will delete the **last two events**.

---

`end_id` **string**

The event ID from which you'd like to end the range of deletion.

If `end_id` is passed without `start_id`, the request will delete all events up
to and including this event ID. For example, if your source has 3 events:

- `1589486981597-0`
- `1589486981598-0`
- `1589486981599-0`

and you issue a `DELETE` request like so:

```shell
curl -X DELETE \
  -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_abc123/events?end_id=1589486981598-0"
```

The request will delete the **first two events**.

---

#### Example Request

You can delete a single event by passing its event ID in both the value of the
`start_id` and `end_id` params:

```shell
curl -X DELETE \
  -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_abc123/events?start_id=1589486981598-0&end_id=1589486981598-0"
```

#### Example Response

Deletion happens asynchronously, so you'll receive a `202 Accepted` HTTP status
code in response to any deletion requests.

## Organizations

[Organizations](/orgs/) provide your team a way to manage resources in a shared workspace. Any resources created by the org are owned by the org and accessible to its members.

### Get Org's Subscriptions

---

Retrieve all the [subscriptions](#subscriptions) configured for a specific organization.

#### Endpoint

```
GET /orgs/<org_id>/subscriptions
```

#### Path Parameters

`org_id` **string**

[Switch to your org's context](/orgs/#switching-context) and [find your org's ID](/orgs/#finding-your-organization-s-id).

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/orgs/o_abc123/subscriptions' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "data": [
    {
      "id": "sub_abc123",
      "emitter_id": "dc_abc123",
      "listener_id": "p_abc123",
      "event_name": ""
    },
    {
      "id": "sub_def456",
      "emitter_id": "dc_def456",
      "listener_id": "p_def456",
      "event_name": ""
    }
  ]
}
```

### Get Org's Sources

---

Retrieve all the [event sources](#sources) configured for a specific organization.

#### Endpoint

```
GET /orgs/<org_id>/sources
```

#### Path Parameters

`org_id` **string**

[Switch to your org's context](/orgs/#switching-context) and [find your org's ID](/orgs/#finding-your-organization-s-id).

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/orgs/o_abc123/sources' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "page_info": {
    "total_count": 19,
    "count": 10,
    "start_cursor": "ZGNfSzB1QWVl",
    "end_cursor": "ZGNfeUx1alJx"
  },
  "data": [
    {
      "id": "dc_abc123",
      "component_id": "sc_def456",
      "configured_props": {
        "http": {
          "endpoint_url": "https://myendpoint.m.pipedream.net"
        }
      },
      "active": true,
      "created_at": 1587679599,
      "updated_at": 1587764467,
      "name": "test",
      "name_slug": "test"
    }
  ]
}
```

## Sources

Event sources run code to collect events from an API, or receive events via
webhooks, emitting those events for use on Pipedream. Event sources can function
as workflow triggers. [Read more here](/sources/).

### List Current User Sources

---

#### Endpoint

```
GET /users/me/sources/
```

#### Parameters

_No parameters_

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/users/me/sources' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "page_info": {
    "total_count": 19,
    "count": 10,
    "start_cursor": "ZGNfSzB1QWVl",
    "end_cursor": "ZGNfeUx1alJx"
  },
  "data": [
    {
      "id": "dc_abc123",
      "component_id": "sc_def456",
      "configured_props": {
        "http": {
          "endpoint_url": "https://myendpoint.m.pipedream.net"
        }
      },
      "active": true,
      "created_at": 1587679599,
      "updated_at": 1587764467,
      "name": "test",
      "name_slug": "test"
    }
  ]
}
```

### Create a Source

---

#### Endpoint

```
POST /sources/
```

#### Parameters

---

`component_id` **string** (_optional_)

The ID of a component previously created in your account. [See the component
endpoints](/api/rest/#components) for information on how to retrieve this ID.

---

`component_code` **string** (_optional_)

The full code for a [Pipedream component](/components/api/).

---

`component_url` **string** (_optional_)

A reference to the URL where the component is hosted.

For example, to create an RSS component, pass
`https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js`.

---

One of `component_id`, `component_code`, or `component_url` is required. If all
are present, `component_id` is preferred and `component_url` will be used only
as metadata to identify the location of the code.

---

`name` **string** (_optional_)

The name of the source.

If absent, this defaults to using the [name
slug](/components/api/#component-structure)
of the component used to create the source.

#### Example Request

```shell
curl https://api.pipedream.com/v1/sources \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js", "name": "your-name-here", "configured_props": { "url": "https://rss.m.pipedream.net", "timer": { "intervalSeconds": 60 }}}'
```

#### Example Response

Example response from creating an RSS source that runs once a minute:

```json
{
  "data": {
    "id": "dc_abc123",
    "user_id": "u_abc123",
    "component_id": "sc_abc123",
    "configured_props": {
      "url": "https://rss.m.pipedream.net",
      "timer": {
        "cron": null,
        "interval_seconds": 60
      }
    },
    "active": true,
    "created_at": 1589486978,
    "updated_at": 1589486978,
    "name": "your-name-here",
    "name_slug": "your-name-here"
  }
}
```

---

### Update a source

---

#### Endpoint

```
PUT /sources/{id}
```

#### Parameters

---

`component_id` **string** (_optional_)

The ID of a component previously created in your account. [See the component
endpoints](/api/rest/#components) for information on how to retrieve this ID.

---

`component_code` **string** (_optional_)

The full code for a [Pipedream
component](/components/api/).

---

`component_url` **string** (_optional_)

A reference to the URL where the component is hosted.

For example, to create an RSS component, pass
`https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js`.

---

One of `component_id`, `component_code`, or `component_url` is required. If all
are present, `component_id` is preferred and `component_url` will be used only
as metadata to identify the location of the code.

---

`name` **string** (_optional_)

The name of the source.

If absent, this defaults to using the [name slug](/components/api/#component-structure)
of the component used to create the source.

---

`active` **boolean** (_optional_)

The active state of a component. To disable a component, set to `false`. To
enable a component, set to `true`.

Default: `true`.

### Delete a source

---

#### Endpoint

```
DELETE /sources/{id}
```

## Subscriptions

### Listen for events from another source or workflow

---

You can configure a source, or a workflow, to receive events from any number of
other workflows or sources. For example, if you want a single workflow to run on
10 different RSS sources, you can configure the workflow to _listen_ for events
from those 10 sources.

**Currently, this feature is enabled only on the API. The Pipedream UI will not
display the sources configured as listeners using this API**.

---

#### Endpoint

```
POST /subscriptions?emitter_id={emitting_component_id}&event_name={event_name}&listener_id={receiving_source_id}
```

#### Parameters

---

`emitter_id` **string**

The ID of the workflow or component emitting events. Events from this component
trigger the receiving component / workflow.

`emitter_id` also accepts glob patterns that allow you to subscribe to _all_
workflows or components:

- `p_*`: Listen to events from all workflows
- `dc_*`: Listen to events from all event sources

[See the component endpoints](/api/rest/#components) for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string `p_2gCPml` in
`https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.

---

`event_name` **string** (optional)

**Only pass `event_name` when you're listening for events on a custom channel, with the name of the custom channel**:

```
event_name=<custom_channel>
```

See [the `this.$emit` docs](/components/api/#emit) for more information on how to emit events on custom channels.

Pipedream also exposes channels for logs and errors:

- `$errors`: Any errors thrown by workflows or sources are emitted to this
  stream
- `$logs`: Any logs produced by **event sources** are emitted to this stream

---

`listener_id` **string**

The ID of the component or workflow you'd like to receive events.

[See the component endpoints](/api/rest/#components) for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string `p_2gCPml` in
`https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.

---

#### Example Request

You can configure workflow `p_abc123` to listen to events from the source
`dc_def456` using the following command:

```shell
curl "https://api.pipedream.com/v1/subscriptions?emitter_id=dc_def456&listener_id=p_abc123" \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

### Automatically subscribe a listener to events from new workflows / sources

---

You can use this endpoint to automatically receive events, like workflow errors,
in another listening workflow or event source. Once you setup the
auto-subscription, any new workflows or event sources you create will
automatically deliver the specified events to the listener.

Note: this will configure subscriptions for _new_ workflows and sources after
the time you configure the subscription. To deliver events to your listener from
_existing_ workflows or sources, use the [`POST /subscriptions`
endpoint](#listen-for-events-from-another-source-or-workflow).

**Currently, this feature is enabled only on the API. The Pipedream UI will not
display the sources configured as listeners using this API**.

---

#### Endpoint

```
POST /auto_subscriptions?event_name={event_name}&listener_id={receiving_source_id}
```

#### Parameters

---

`event_name` **string**

The name of the event stream whose events you'd like to receive:

- `$errors`: Any errors thrown by workflows or sources are emitted to this
  stream
- `$logs`: Any logs produced by **event sources** are emitted to this stream

---

`listener_id` **string**

The ID of the component or workflow you'd like to receive events.

[See the component endpoints](/api/rest/#components) for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string `p_2gCPml` in
`https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.

---

#### Example Request

You can configure workflow `p_abc123` to listen to events from the source
`dc_def456` using the following command:

```shell
curl "https://api.pipedream.com/v1/auto_subscriptions?event_name=$errors&listener_id=p_abc123" \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

### Delete a subscription

---

Use this endpoint to delete an existing subscription. This endpoint accepts the
same parameters as the [`POST /subscriptions`
endpoint](#listen-for-events-from-another-source-or-workflow) for creating
subscriptions.

---

#### Endpoint

```
DELETE /subscriptions?emitter_id={emitting_component_id}&listener_id={receiving_source_id}&event_name={event_name}
```

#### Parameters

---

`emitter_id` **string**

The ID of the workflow or component emitting events. Events from this component
trigger the receiving component / workflow.

`emitter_id` also accepts glob patterns that allow you to subscribe to _all_
workflows or components:

- `p_*`: Listen to events from all workflows
- `dc_*`: Listen to events from all event sources

[See the component endpoints](/api/rest/#components) for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string `p_2gCPml` in
`https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.

---

`listener_id` **string**

The ID of the component or workflow you'd like to receive events.

[See the component endpoints](/api/rest/#components) for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string `p_2gCPml` in
`https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.

---

`event_name` **string**

The name of the event stream tied to your subscription. **If you didn't specify
an `event_name` when creating your subscription, pass `event_name=`**.

You'll find the `event_name` that's tied to your subscription when [listing your
subscriptions](#get-current-user-s-subscriptions):

```javascript
{
  "id": "sub_abc123",
  "emitter_id": "dc_abc123",
  "listener_id": "dc_def456",
  "event_name": "test"
},
{
  "id": "sub_def456",
  "emitter_id": "dc_abc123",
  "listener_id": "wh_abc123",
  "event_name": ""
}
```

---

#### Example Request

You can delete a subscription you configured for workflow `p_abc123` to listen
to events from the source `dc_def456` using the following command:

```shell
curl "https://api.pipedream.com/v1/subscriptions?emitter_id=dc_def456&listener_id=p_abc123" \
  -X DELETE \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

## Webhooks

Pipedream supports webhooks as a way to deliver events to a endpoint you own.
Webhooks are managed at an account-level, and you send data to these webhooks
using [subscriptions](#subscriptions).

For example, you can run a Twitter [event source](/sources/) that listens
for new tweets. If you [subscribe](#subscriptions) the webhook to this source,
Pipedream will deliver those tweets directly to your webhook's URL without
running a workflow.

[**See these tutorials**](/api/rest/webhooks/) for examples.

### Create a webhook

Creates a webhook pointing to a URL. Configure a [subscription](#subscriptions)
to deliver events to this webhook.

#### Endpoint

```
POST /webhooks?url={your_endpoint_url}&name={name}&description={description}
```

#### Parameters

---

`url` **string**

The endpoint URL where you'd like to deliver events. Any events sent to this
webhook object will be delivered to this endpoint URL.

This URL **must** contain, at a minimum, a protocol — one of `http` or `https` —
and hostname, but can specify resources or ports. For example, these URLs work:

```
https://example.com
http://example.com
https://example.com:12345/endpoint
```

but these do not:

```
# No protocol - needs http(s)://
example.com

# mysql protocol not supported. Must be an HTTP(S) endpoint
mysql://user:pass@host:port
```

---

`name` **string**

The name you'd like to assign to this webhook, which will appear when [listing
your webhooks](#get-current-user-s-webhooks).

---

`description` **string**

The description you'd like to assign to this webhook, which will appear when
[listing your webhooks](#get-current-user-s-webhooks).

#### Example Request

You can create a webhook that delivers events to
`https://endpoint.m.pipedream.net` using the following command:

```shell
curl "https://api.pipedream.com/v1/webhooks?url=https://endpoint.m.pipedream.net&name=name&description=description" \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

#### Example Response

Successful API responses contain a webhook ID for the webhook that was created
in `data.id` — the string that starts with `wh_` — which you can reference when
creating [subscriptions](#subscriptions).

```json
{
  "data": {
    "id": "wh_abc123",
    "user_id": "u_abc123",
    "name": null,
    "description": null,
    "url": "https://endpoint.m.pipedream.net",
    "active": true,
    "created_at": 1611964025,
    "updated_at": 1611964025
  }
}
```

### List webhooks

You can list webhooks you've created in your account using the
[`/users/me/webhooks` endpoint](#get-current-user-s-webhooks)

### Delete a webhook

---

Use this endpoint to delete a webhook in your account.

#### Endpoint

```
DELETE /webhooks/{id}
```

#### Path Parameters

---

`id` **string**

The ID of a webhook in your account.

---

#### Example Request

```shell
curl "https://api.pipedream.com/v1/webhooks/wh_abc123" \
  -X DELETE \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

## Workflows

### Get Workflow Emits

---

Retrieve up to the last 100 events emitted from a workflow using
[`$send.emit()`](/destinations/emit/#emit-events).

#### Endpoint

```
GET /workflows/{workflow_id}/event_summaries
```

#### Notes and Examples

The event data for events larger than `1KB` may get truncated in the response.
If you're retrieving larger events, and need to see the full event data, pass
`?expand=event`:

```
GET /workflows/{workflow_id}/event_summaries&expand=event
```

Pass `?limit=N` to retrieve the last **N** events:

```
GET /v1/workflows/{workflow_id}/event_summaries?expand=event&limit=1
```

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/workflows/p_abc123/event_summaries?expand=event&limit=1' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "page_info": {
    "total_count": 1,
    "start_cursor": "1606511826306-0",
    "end_cursor": "1606511826306-0",
    "count": 1
  },
  "data": [
    {
      "id": "1606511826306-0",
      "indexed_at_ms": 1606511826306,
      "event": {
        "raw_event": {
          "name": "Luke",
          "title": "Jedi"
        }
      },
      "metadata": {
        "emit_id": "1ktF96gAMsLqdYSRWYL9KFS5QqW",
        "name": "",
        "emitter_id": "p_abc123"
      }
    }
  ]
}
```

---

### Get Workflow Errors

---

Retrieve up to the last 100 events for a workflow that threw an error. The
details of the error, along with the original event data, will be included

#### Endpoint

```
GET /workflows/{workflow_id}/$errors/event_summaries
```

#### Notes and Examples

The event data for events larger than `1KB` may get truncated in the response.
If you're processing larger events, and need to see the full event data, pass
`?expand=event`:

```
GET /workflows/{workflow_id}/$errors/event_summaries&expand=event
```

Pass `?limit=N` to retrieve the last **N** events:

```
GET /v1/workflows/{workflow_id}/$errors/event_summaries?expand=event&limit=1
```

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/workflows/p_abc123/$errors/event_summaries?expand=event&limit=1' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "page_info": {
    "total_count": 100,
    "start_cursor": "1606370816223-0",
    "end_cursor": "1606370816223-0",
    "count": 1
  },
  "data": [
    {
      "id": "1606370816223-0",
      "indexed_at_ms": 1606370816223,
      "event": {
        "original_event": {
          "name": "Luke",
          "title": "Jedi"
        },
        "original_context": {
          "id": "1kodJIW7jVnKfvB2yp1OoPrtbFk",
          "ts": "2020-11-26T06:06:44.652Z",
          "workflow_id": "p_abc123",
          "deployment_id": "d_abc123",
          "source_type": "SDK",
          "verified": false,
          "owner_id": "u_abc123",
          "platform_version": "3.1.20"
        },
        "error": {
          "code": "InternalFailure",
          "cellId": "c_abc123",
          "ts": "2020-11-26T06:06:56.077Z",
          "stack": "    at Request.extractError ..."
      },
      "metadata": {
        "emitter_id": "p_abc123",
        "emit_id": "1kodKnAdWGeJyhqYbqyW6lEXVAo",
        "name": "$errors"
      }
    }
  ]
}
```

## Users

### Get Current User Info

---

Retrieve information on the authenticated user.

#### Endpoint

```
GET /users/me
```

#### Parameters

_No parameters_

#### Example Request

```bash
curl 'https://api.pipedream.com/v1/users/me' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

Free user:

```json
{
  "data": {
    "id": "u_abc123",
    "username": "dylburger",
    "email": "dylan@pipedream.com",
    "orgs": [
      {
        "name": "MyTestOrg",
        "id": "o_abc123",
        "orgname": "mytestorg",
        "email": "test@pipedream.com"
      }
    ],
    "daily_compute_time_quota": 95400000,
    "daily_compute_time_used": 8420300,
    "daily_invocations_quota": 27344,
    "daily_invocations_used": 24903
  }
}
```

Paid user:

```json
{
  "data": {
    "id": "u_abc123",
    "username": "dylburger",
    "email": "dylan@pipedream.com",
    "billing_period_start_ts": 1610154978,
    "billing_period_end_ts": 1612833378,
    "billing_period_invocations": 12345
  }
}
```

### Get Current User's Subscriptions

---

Retrieve all the [subscriptions](#subscriptions) configured for the
authenticated user.

#### Endpoint

```
GET /users/me/subscriptions
```

#### Parameters

_No parameters_

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/users/me/subscriptions' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "data": [
    {
      "id": "sub_abc123",
      "emitter_id": "dc_abc123",
      "listener_id": "p_abc123",
      "event_name": ""
    },
    {
      "id": "sub_def456",
      "emitter_id": "dc_def456",
      "listener_id": "p_def456",
      "event_name": ""
    }
  ]
}
```

### Get Current User's Webhooks

---

Retrieve all the [webhooks](#webhooks) configured for the authenticated user.

#### Endpoint

```
GET /users/me/webhooks
```

#### Parameters

_No parameters_

#### Example Request

```shell
curl 'https://api.pipedream.com/v1/users/me/webhooks' \
  -H 'Authorization: Bearer <api_key>'
```

#### Example Response

```json
{
  "page_info": {
    "total_count": 2,
    "count": 2,
    "start_cursor": "d2hfMjlsdUd6",
    "end_cursor": "d2hfb3dHdWVv"
  },
  "data": [
    {
      "id": "wh_abc123",
      "name": null,
      "description": null,
      "url": "https://endpoint.m.pipedream.net",
      "active": true,
      "created_at": 1611964025,
      "updated_at": 1611964025
    },
    {
      "id": "wh_def456",
      "name": "Test webhook",
      "description": "just a test",
      "url": "https://endpoint2.m.pipedream.net",
      "active": true,
      "created_at": 1605835136,
      "updated_at": 1605835136
    }
  ]
}
```

<Footer />
