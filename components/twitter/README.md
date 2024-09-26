# Overview

The Twitter API on Pipedream enables you to automate interactions with Twitter, from posting tweets to analyzing social media trends. Pipedream's serverless platform provides the tools to create workflows that trigger on specific Twitter activities, process data, and connect with countless other apps for extensive automation scenarios. With Pipedream's integration, you can listen for events such as new tweets, mentions, or followers, and execute actions like tweeting, retweeting, or even leveraging sentiment analysis to gauge public perception.


# Getting Started
In order to connect your Twitter account to Pipedream, you'll need to create a developer project and app.
1. First, visit Twitter's [developer dashboard](https://developer.twitter.com/en/portal/dashboard) and sign in
2. Next, [create a new project](https://developer.twitter.com/en/portal/projects/new) and give it a name, select a use case, and provide a description

## Creating a Project and App
1. Provide a name for your app
2. Note the API Key and API Key Secret that are displayed (the setup isn't done yet, but note these down)
3. Click "App settings" at the bottom right of the screen

## Configuring Authentication Settings
1. In the bottom of your app's settings, in the "User Authentication Settings", choose "Set Up"
2. Select the appropriate app permissions based on your use case
3. Select "**Web App, Automated App or Bot** (Confidential client)" in the "Type of App" section
4. Enter this URI in the "Callback URI / Redirect URI": `https://api.pipedream.com/connect/oauth/oa_gk6iBa/callback`
5. Enter a website URL
6. Click "Done" (the Client ID and Client Secret that are shown on the next page are not required for this setup)
7. Enter the API Key and API Key Secret when prompted in Pipedream (if you lose them and need to regenerate new keys, you can do so from the "Keys and tokens" tab in your app's settings in Twitter's developer dashboard, in the "Consumer Keys" section)

![Consumer API key](https://res.cloudinary.com/dpenc2lit/image/upload/v1684365722/Screenshot_2023-05-17_at_4.19.52_PM_jlvbvw.png)

# Example Use Cases

- **Automated Tweeting of Curated Content:** Create a workflow that monitors RSS feeds or other content sources. When new items are detected, format the content and automatically post it to your Twitter account, keeping your followers engaged with fresh and relevant content.

- **Twitter Sentiment Analysis:** Set up a workflow that triggers on new mentions of your username on Twitter. Pass the tweet text to a sentiment analysis service like Google's Natural Language API to determine the emotion conveyed. Use this data to respond appropriately or to gather insights on public perception.

- **Customer Support Ticketing:** Develop a workflow that starts when your company's Twitter account receives a direct message. Automatically create a ticket in a customer support platform like Zendesk or HubSpot, ensuring that your team promptly addresses customer inquiries and issues mentioned on Twitter.

# Troubleshooting
Below are some of the most common issues we see.

## Issues Connecting Twitter
If you run into an error during the app connection process, make sure to doublecheck the below configurations:
1. Ensure that you've entered the correct `developer_consumer_key` and `developer_consumer_secret` in Pipedream. These map to Twitter's "API Key" and "API Key Secret" in the "Keys & Tokens" section in their dashboard.
2. Make sure the "Callback URI / Redirect URL" that you configure within the "User Authentication settings" for your app in Twitter's developer console exactly matches: `https://api.pipedream.com/connect/oauth/oa_gk6iBa/callback`

## Errors from Twitter's API or Twitter Sources and Actions
1. Free Twitter developer accounts only have access to **write** endpoints (for example, actions like "Create Tweet" and "Create Retweet")
2. Twitter developer accounts on their Basic plan have access to **write** and **read** endpoints (for example, actions like "Create Tweet" and "Search Tweets", as well as sources like "New Post Matching Query")
3. If you are getting errors from the Twitter sources or actions, please consult the developer plan to confirm if you have access to those endpoints.