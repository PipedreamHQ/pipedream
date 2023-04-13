# Overview

<img alt="Connecting Zoom to any app using Pipedream" src="https://res.cloudinary.com/pipedreamin/image/upload/v1681317323/docs/components/zoom/event-sources_mps8ws.png" />

**Pipedream [workflows](/workflows/) allow you to run any Node.js code that connects to the Zoom API**. Just [create a new workflow](https://pipedream.com/new), then add prebuilt Zoom [actions](/components#actions) (create a meeting, send a chat message, etc.) or [write your own code](/code/). These workflows can be triggered by HTTP requests, timers, email, or on any app-based event (new tweets, a Github PR, Zoom events, etc). 





## Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com).
2. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts).
3. Click the button labeled **Click Here to Connect an App**.
4. Search for "Zoom" and select either **Zoom** or **Zoom Admin** ([see the differences below](#zoom-vs-zoom-admin-app)):

This will open up a new window prompting you to authorize Pipedream's access to your Zoom account. Once you authorize access, you should see your Zoom account listed among your apps.

1. [Create a new workflow](https://pipedream.com/new), [add a new step](/workflows/steps/), search for "Zoom" or "Zoom Admin". Once you've selected either app, you can choose to either "Run Node.js code" or select one of the prebuilt actions for performing common API operations.
2. At this stage, you'll be asked to link the Zoom account you connected above, authorizing the request to the Zoom API with your credentials:

<img src="[./images/connect-zoom-account.png](https://res.cloudinary.com/pipedreamin/image/upload/v1681317323/docs/components/zoom/connect-zoom-account_pagw1y.png)" alt="Connect Zoom Account" width="500px;" />

### Zoom vs Zoom Admin app

Zoom users can be classified into two groups: non-admins and admins. Admins have account-level permissions that users do not, and Zoom has corresponding admin-level scopes that aren't relevant for normal users. Therefore, Pipedream exposes two apps — **Zoom** and **Zoom Admin** — to serve the two groups.

In the Zoom Marketplace, these apps are named [Pipedream](https://marketplace.zoom.us/apps/jGaV-kRrT3igAYnn-J5v2g), and [Pipedream for Zoom Admins](https://marketplace.zoom.us/apps/tZvUsiucR96SqtvfBsemXg), respectively.

Non-admins have [permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions#user-managed-scopes) to manage standard Zoom resources in their account: meetings, webinars, recordings, and more. **If you're a non-admin, you'll want to use the Zoom app**.

Zoom admins have [permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions#account-level-scopes) to manage account-level resources, like users and reports. They can also manage webinars and meetings across their organization. **If you're an admin and need to manage these resources via API, you'll want to use the Zoom Admin app**.

The [Zoom API docs on permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions) provide detailed information on these permissions and their associated OAuth scopes.
