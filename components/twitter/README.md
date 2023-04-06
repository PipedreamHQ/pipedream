# Getting Started
In order to connect your Twitter account to Pipedream, you'll need to create a developer project and app.
1. First, visit Twitter's [developer dashboard](https://developer.twitter.com/en/portal/dashboard) and sign in
2. Next, [create a new project](https://developer.twitter.com/en/portal/projects/new) and give it a name, select a use case, and provide a description

## Creating a Project and App
1. Select the app environment
2. Provide a name for your app
3. It's important to note the API Key, API Key Secret, and Bearer Token that are displayed
4. In the bottom of your app's settings, in the "User Authentication Settings", choose "Set Up"
5. Select the appropriate app permissions based on your use case
6. Select "**Web App, Automated App or Bot**" in the "Type of App" section
7. Enter this URI in the "Callback URI / Redirect URI": `https://api.pipedream.com/connect/oauth/oa_gk6iBa/callback`
8. Note the Client ID and Client Secret you are shown on the next page, and paste them when connecting your account

## Determining the right scopes to use
- To default the scopes to those that are required for the built-in triggers and actions in Pipedream's registry, paste these scopes when connecting your account:
```
tweet.write follows.read follows.write like.read like.write list.read list.write
```
- For greater customization, refer to [Twitter's documentation on **Scopes**](https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code) to determine the specific scopes you'd like to include.
**Make sure to separate each scope by a spaces**. For example, `tweet.write follows.read like.read like.write`. 
**Note that the `offline.access users.read tweet.read` are already included.**
