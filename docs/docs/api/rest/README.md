# REST API

[[toc]]

## Overview

Use REST APIs to create and manage sources and source events. Workflow development and management is not currently supported via API.

::: warning
Sources and related APIs are current currently available for developers to preview. During the preview period features and APIs may change without advance notice. Please reach out on [Slack](https://pipedream.com/community) or raise an issue on our [Github repo](https://github.com/PipedreamHQ/pipedream) with any questions or suggestions.
:::

## Base URL

The base URL for all requests is **{{$site.themeConfig.API_BASE_URL}}** .

## Authentication

Pipedream uses [Bearer Authentication](https://oauth.net/2/bearer-tokens/) to authorize your access to the API. When you make API requests, pass an `Authorization` header of the following format:

```
Authorization: Bearer <api key>
```

For example, here's how you can use `cURL` to fetch profile information for the authenticated user:

```bash
curl 'https://api.pipedream.com/v1/users/me' \
  -H 'Authorization: Bearer <api_key>'
```

Learn more about [API authentication](/api/auth)

## Required headers

The `Authorization` header is required on all endpoints for authentication.

`POST` or `PUT` requests that accept JSON payloads also require a `Content-Type` header set to `application/json`. For example:

```bash
curl https://api.pipedream.com/v1/components \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/components/rss/rss.js"}'
```

## Common Parameters

The following parameters can be passed to any endpoint. They can be included as query string params for `GET` requests, or in the body of the payload of `POST` requests.

---

`include` **string**

The fields in the API response you'd like to include (defaults to all fields). Pass as a string of comma-separated values:

`comma,separated,fields,to,include`

---

`exclude` **string**

The fields in the API response you'd like to _exclude_ (defaults to none, including all fields). Pass as a string of comma-separated values:

`comma,separated,fields,to,include`

---

## Pagination

Most API endpoints below support pagination, **with a default page size of 10 items**. You can vary the size of pages, and set a `before` or `after` cursor on the results, using the following parameters. They can be included as query string params for `GET` requests, or in the body of the payload of `POST` requests.

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

**Example Paginated Request**

This request fetches a page of 5 sources in the authenticated account, after a specific cursor (returned with a previous request):

```bash
curl https://api.pipedream.com/v1/users/me/sources\?limit\=3\&after\=ZGNfSzB1QWVl \
  -H "Authorization: Bearer <api key>"
```

**Example Paginated Response**

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

Pipedream uses conventional HTTP response codes to indicate the success or failure of an API request. Codes in the **2xx** range indicate success. Codes in the **4xx** range indicate an error that failed (e.g., a required parameter was omitted). Codes in the **5xx** range indicate an error with Pipedream’s server.

## Operations

### Users

---

#### Get Current User Info

---

Retrieve information on the authenticated user.

**Endpoint**

```
GET /users/me
```

**Parameters**

_No parameters_

**Example Request**

```
curl 'https://api.pipedream.com/v1/users/me' \
  -H 'Authorization: Bearer <api_key>'
```

**Example Response**

```json
{
  "data": {
    "id": "u_aPmhl8",
    "username": "dylburger",
    "email": "dylan@pipedream.com",
    "admin": true,
    "api_key": "XXX",
    "daily_compute_time_quota": 95400000,
    "daily_compute_time_used": 8420300,
    "daily_invocations_quota": 27344,
    "daily_invocations_used": 24903
  }
}
```

### Components

---

#### Create a component

---

Before you can create a source using the REST API, you must first create a **component** - the code for the source.

This route returns the components `id`, `code`, `configurable_props`, and other metadata you'll need to [deploy a source](#create-a-source) from this component.

**Endpoint**

```
POST /components
```

**Parameters**

---

`component_code` **string** (_optional_)

The full code for a [Pipedream component](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md).

---

`component_url` **string** (_optional_)

A reference to the URL where the component is hosted.

For example, to create an RSS component, pass `https://github.com/PipedreamHQ/pipedream/components/rss/rss.js`.

---

One of `component_code` _or_ `component_url` is required. If both are present, `component_code` is preferred and `component_url` will be used only as metadata to identify the location of the code.

**Example Request**

Here's an example of how to create an RSS component from a Github URL:

```bash
curl https://api.pipedream.com/v1/components \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/components/rss/rss.js"}'
```

**Example Response**

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

#### Get a component

Retrieve a component saved or published in your account using its saved component ID **or** key.

This endpoint returns the component's metadata and configurable props.

**Endpoint**

```
GET /components/{key|id}
```

**Parameters**

---

`key` **string**

The component key (identified by the `key` property within the component's source code) you'd like to fetch metadata for (example: `my-component`)

**or**

`id` **string**

The saved component ID you'd like to fetch metadata for (example: `sc_JDi8EB`)

---

**Example Request**

```bash
curl https://api.pipedream.com/v1/components/my-component \
  -H "Authorization: Bearer <api_key>"
```

**Example Response**

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

#### Get a component from the global registry

Pipedream operates a global registry of all public components (for example, for apps like Github, Google Calendar, and more). This endpoint returns the same data as the endpoint for [retrieving metadata on a component you own](#get-a-component), but allows you to fetch data for any globally-published component.

**Endpoint**

```
GET /components/registry/{key}
```

**Parameters**

---

`key` **string**

The component key (identified by the `key` property within the component's source code) you'd like to fetch metadata for (example: `my-component`)

---

**Example Request**

```bash
curl https://api.pipedream.com/v1/components/registry/github-new-repository \
  -H "Authorization: Bearer <api_key>"
```

**Example Response**

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

### Sources

---

#### List Current User Sources

---

**Endpoint**

```
GET /users/me/sources/
```

**Parameters**

_No parameters_

**Example Request**

```bash
curl 'https://api.pipedream.com/v1/users/me/sources' \
  -H 'Authorization: Bearer <api_key>'
```

**Example Response**

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
```

#### Create a Source

---

**Endpoint**

```
POST /sources/
```

**Parameters**

---

`component_id` **string** (_optional_)

The ID of a component previously created in your account. [See the component endpoints](/api/rest/#components) for informtion on how to retrieve this ID.

---

`component_code` **string** (_optional_)

The full code for a [Pipedream component](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md).

---

`component_url` **string** (_optional_)

A reference to the URL where the component is hosted.

For example, to create an RSS component, pass `https://github.com/PipedreamHQ/pipedream/components/rss/rss.js`.

---

One of `component_id`, `component_code`, or `component_url` is required. If all are present, `component_id` is preferred and `component_url` will be used only as metadata to identify the location of the code.

---

`name` **string** (_optional_)

The name of the source.

If absent, this defaults to using the [name slug](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#component-structure) of the component used to create the source.

**Example Request**

```bash
curl https://api.pipedream.com/v1/sources \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{"component_url": "https://github.com/PipedreamHQ/pipedream/components/rss/rss.js", "name": "your-name-here", "configured_props": { "url": "https://rss.m.pipedream.net", "timer": { "intervalSeconds": 60 }}}'
```

**Example Response**

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

#### Update a source

---

**Endpoint**

```
PUT /sources/{id}
```

**Parameters**

---

`component_id` **string** (_optional_)

The ID of a component previously created in your account. [See the component endpoints](/api/rest/#components) for information on how to retrieve this ID.

---

`component_code` **string** (_optional_)

The full code for a [Pipedream component](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md).

---

`component_url` **string** (_optional_)

A reference to the URL where the component is hosted.

For example, to create an RSS component, pass `https://github.com/PipedreamHQ/pipedream/components/rss/rss.js`.

---

One of `component_id`, `component_code`, or `component_url` is required. If all are present, `component_id` is preferred and `component_url` will be used only as metadata to identify the location of the code.

---

`name` **string** (_optional_)

The name of the source.

If absent, this defaults to using the [name slug](https://github.com/PipedreamHQ/pipedream/blob/master/COMPONENT-API.md#component-structure) of the component used to create the source.

---

`active` **boolean** (_optional_)

The active state of a component. To disable a component, set to `false`. To enable a component, set to `true`.

Default: `true`.

#### Delete a source

---

**Endpoint**

```
DELETE /sources/{id}
```

### Subscriptions

#### Listen for events from another source

---

You can configure a source, or a workflow, to receive events from any number of other sources. For example, if you want a single workflow to run on 10 different RSS sources, you can configure the workflow to _listen_ for events from those 10 sources.

**Currently, this feature is enabled only on the API. The Pipedream UI will not display the sources configured as listeners using this API**.

---

**Endpoint**

```
POST /subscriptions?emitter_id={emitting_component_id}&listener_id={receiving_source_id}
```

**Parameters**

---

`emitter_id` **string**

The ID of the component emitting events. Events from this component trigger the receiving component / workflow.

[See the component endpoints](/api/rest/#components) for information on how to retrieve the ID of existing components. You can retrieve the ID of your workflow in your workflow's URL - it's the string `p_2gCPml` in `https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.

---

`listener_id` **string**

The ID of the component or workflow you'd like to receive events.

[See the component endpoints](/api/rest/#components) for information on how to retrieve the ID of existing components. You can retrieve the ID of your workflow in your workflow's URL - it's the string `p_2gCPml` in `https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit`.
**Example Request**

You can configure workflow `p_abc123` to listen to events from the source `dc_def456` using the following command:

```bash
curl "https://api.pipedream.com/v1/subscriptions?emitter_id=dc_def456&listener_id=p_abc123" \
  -X POST \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json"
```

### Events

---

#### Get Source Events

---

Retrieve up to the last 100 events emitted by a source.

**Endpoint**

```
GET /sources/{id}/event_summaries
```

**Notes and Examples**

The event data for events larger than `1KB` may get truncated in the response. If you're processing larger events, and need to see the full event data, pass `?expand=event`:

```
GET /sources/{id}/event_summaries?expand=event
```

Pass `?limit=N` to retrieve the last **N** events:

```
GET /sources/{id}/event_summaries?limit=10
```

#### Delete source events

---

Deletes all events, or a specific set of events, tied to a source.

By default, making a `DELETE` request to this endpoint deletes **all** events associated with a source. To delete a specific event, or a range of events, you can use the `start_id` and `end_id` parameters.

These IDs can be retrieved by using the [`GET /sources/{id}/event_summaries` endpoint](/api/rest/#get-source-events), and are tied to the timestamp at which the event was emitted — e.g. `1589486981597-0`. They are therefore naturally ordered by time.

**Endpoint**

```
DELETE /sources/{id}/events
```

**Parameters**

---

`start_id` **string**

The event ID from which you'd like to start deleting events.

If `start_id` is passed without `end_id`, the request will delete all events starting with and including this event ID. For example, if your source has 3 events:

- `1589486981597-0`
- `1589486981598-0`
- `1589486981599-0`

and you issue a `DELETE` request like so:

```bash
curl -X DELETE \
  -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_abc123/events?start_id=1589486981598-0"
```

The request will delete the **last two events**.

---

`end_id` **string**

The event ID from which you'd like to end the range of deletion.

If `end_id` is passed without `start_id`, the request will delete all events up to and including this event ID. For example, if your source has 3 events:

- `1589486981597-0`
- `1589486981598-0`
- `1589486981599-0`

and you issue a `DELETE` request like so:

```bash
curl -X DELETE \
  -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_abc123/events?end_id=1589486981598-0"
```

The request will delete the **first two events**.

---

**Example Request**

You can delete a single event by passing its event ID in both the value of the `start_id` and `end_id` params:

```bash
curl -X DELETE \
  -H "Authorization: Bearer <api key>" \
  "https://api.pipedream.com/v1/sources/dc_abc123/events?start_id=1589486981598-0&end_id=1589486981598-0"
```

**Example Response**

Deletion happens asynchronously, so you'll receive a `202 Accepted` HTTP status code in response to any deletion requests.

<Footer />
