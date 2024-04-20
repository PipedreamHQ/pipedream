# Overview

Cisco Webex (Custom App) API on Pipedream allows users to automate actions within the Webex platform and connect them with other services to streamline communication and collaboration. You can leverage the API to create participants, send messages in spaces, and manage meetings programmatically. Pipedream's serverless platform enables triggering workflows from various events, processing data, and executing complex actions in response.

# Getting Started

## Creating a custom Webex application
To use your own custom Cisco Webex app, you will need to sign up for a free [Webex developer account](https://developer.webex.com/signup) if you don't already have one, and [create a new app](https://developer.webex.com/my-apps/new).

1. Navigate to **My Webex Apps**, and select **Create an Integration**
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1703182776/Screenshot_2023-12-21_at_9.48.58_AM_sqdtmf.png" width=500 />

2. Name your integration, e.g. "Pipedream" and choose an icon.

3. Write a short description, e.g. "This application is used to connect to the Cisco Webex (Custom App) on Pipedream."

4. For the Redirect URI, copy and paste `https://api.pipedream.com/connect/oauth/oa_aWyi6o/callback`.

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1703182776/Screenshot_2023-12-21_at_9.51.45_AM_o20sqj.png" width=500 />

5. [Scopes](https://developer.webex.com/docs/integrations#scopes) define the level of access that your integration requires. This part of the setup is **critical** to your integration working correctly. Please note that scopes that begin with `spark-admin` can only be used by users with administrative access to an organization.

For example, if I want my application to be able to have full access to my Webex account, so that all APIs that my user can connect to can be accessed by my application on Pipedream, I would select the scope `spark:all`. 

As a general best practice, however, it is best to only the scopes that will you need for your use case. 

6. Select the scopes that you'd like for this integration, scroll down to the bottom and click **Add Integration**.

7. Copy your **Client ID** and **Client Secret**.

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1703182775/Screenshot_2023-12-21_at_10.06.39_AM_luxsjs.png" />

8. If you selected the following scopes: 

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1703182776/Screenshot_2023-12-21_at_10.02.49_AM_wou8ns.png">

you'll need to create a space-separated list of scopes: 
`spark-admin:calling_cdr_read spark:calls_read spark:devices_read spark:devices_write`

9. Copy and paste your **Client ID**, **Client Secret**, and **Space Separated Scopes** on the Cisco Webex (Custom App) account connection page on Pipedream. 

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1703183779/Screenshot_2023-12-21_at_10.35.53_AM_qqz0wh.png" />

# Example Use Cases

- **Automated Meeting Scheduling and Notifications**: Schedule Webex meetings automatically based on calendar events from Google Calendar. When a new event is added to a specific Google Calendar, a Pipedream workflow can trigger to create a Webex meeting and send the meeting details to participants via email or a preferred messaging app.

- **Customer Support Ticket Escalation**: Integrate Cisco Webex with a customer support ticketing system like Zendesk. When a high-priority ticket is received, a workflow can automatically create a Webex space and add the support team for real-time collaboration on resolving the issue. This ensures urgent matters are addressed swiftly.

- **Project Management Updates**: Connect Cisco Webex to a project management tool like Trello or Asana. Whenever a task is updated or completed, a Pipedream workflow can post an update in a dedicated Webex team space, keeping everyone aligned and informed of project progress without manual status reports.
