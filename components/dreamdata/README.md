# Pipedream Dreamdata Components

Build automations on top of [Dreamdata](https://dreamdata.io/), the B2B revenue
attribution platform.

## Actions

All actions wrap Dreamdata's [server-side tracking API](https://developer.dreamdata.io/server-side/server-side-tracking/)
and [Node.js SDK event model](https://developer.dreamdata.io/server-side/nodejs-sdk/)
(`POST /v1/batch`):

- **Track Event** - record an action a user performed.
- **Identify User** - tie a user to their actions and record traits.
- **Track Page View** - record a page view.
- **Identify Company (Group)** - associate a user with a company/account.
- **Alias User** - merge two user identities.
- **Send Batch** - submit a raw batch of events (power user).

## Authentication

Actions use an API key created under **Data Platform > Sources >
Server Side Analytics APIs** in Dreamdata. The key is sent as HTTP Basic auth
(API key as username, empty password).
