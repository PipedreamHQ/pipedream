# Overview
The Zoom API lets you tap into a rich set of functionalities to enhance the video conferencing experience within your own app or workflow. With the Zoom API on Pipedream, you can automatically create meetings, manage users, send meeting notifications, and more, orchestrating these actions within a broader automation. This allows for seamless integration with other services, enabling both data collection and action triggers based on Zoom events.

**Pipedream [workflows](/workflows/) allow you to run any Node.js code that connects to the Zoom API**. Just [create a new workflow](https://pipedream.com/new), then add prebuilt Zoom [actions](/components#actions) (create a meeting, send a chat message, etc.) or [write your own code](/code/). These workflows can be triggered by HTTP requests, timers, email, or on any app-based event (new tweets, a GitHub PR, Zoom events, etc). 

# Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com).
2. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts).
3. Click the button labeled **Click Here to Connect an App**.
4. Search for "Zoom" and select either **Zoom** or **Zoom Admin** ([see the differences below](#zoom-vs-zoom-admin-app)):

This will open up a new window prompting you to authorize Pipedream's access to your Zoom account. Once you authorize access, you should see your Zoom account listed among your apps.

1. [Create a new workflow](https://pipedream.com/new), [add a new step](/workflows/steps/), search for "Zoom" or "Zoom Admin". Once you've selected either app, you can choose to either "Run Node.js code" or select one of the prebuilt actions for performing common API operations.
2. At this stage, you'll be asked to link the Zoom account you connected above, authorizing the request to the Zoom API with your credentials.

## Zoom vs Zoom Admin app

Zoom users can be classified into two groups: non-admins and admins. Admins have account-level permissions that users do not, and Zoom has corresponding admin-level scopes that aren't relevant for normal users. Therefore, Pipedream exposes two apps — **Zoom** and **Zoom Admin** — to serve the two groups.

In the Zoom Marketplace, these apps are named [Pipedream](https://marketplace.zoom.us/apps/jGaV-kRrT3igAYnn-J5v2g), and [Pipedream for Zoom Admins](https://marketplace.zoom.us/apps/tZvUsiucR96SqtvfBsemXg), respectively.

Non-admins have [permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions#user-managed-scopes) to manage standard Zoom resources in their account: meetings, webinars, recordings, and more. **If you're a non-admin, you'll want to use the Zoom app**.

Zoom admins have [permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions#account-level-scopes) to manage account-level resources, like users and reports. They can also manage webinars and meetings across their organization. **If you're an admin and need to manage these resources via API, you'll want to use the Zoom Admin app**.

The [Zoom API docs on permissions](https://marketplace.zoom.us/docs/guides/authorization/permissions) provide detailed information on these permissions and their associated OAuth scopes.

# Example Use Cases

- **Automated Meeting Scheduling and Notifications**: With Pipedream, you can create a workflow that listens for upcoming calendar events in Google Calendar. Once it detects a new event labeled "Zoom Meeting," it can trigger the Zoom API to create a meeting and then automatically send custom email notifications with the meeting details to all the attendees using SendGrid.

- **Zoom Webinar Attendee Management**: Build a workflow where new sign-ups from an event management platform like Eventbrite trigger the addition of these attendees to a Zoom webinar. Post-webinar, send a follow-up email via Mailgun with a link to the webinar recording, which you can upload to a cloud storage platform like Dropbox.

- **Meeting Analytics and Reporting**: Combine Zoom's meeting ended webhook with Pipedream's capabilities to create a workflow that captures meeting details upon conclusion. With this data, you can send a summary email to the host, update a Google Sheet with attendance information, and even push the data to a BI tool like Tableau for more in-depth analysis.
