# Overview

With the Cisco Webex Custom App API, you can build a range of applications that
take advantage of the power of Webex Teams. Here are just a few examples of
what you can build:

1. A message bot that responds to certain keywords or phrases
2. An app that automatically schedules meeting times for team members
3. A app that allows team members to vote on decisions
4. An app that provides real-time translations of team conversations
5. A app that allows team members to share files and documents with each other

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