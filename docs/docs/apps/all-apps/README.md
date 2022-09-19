# Integrated Apps

Pipedream has built-in integrations with more than {{$site.themeConfig.PUBLIC_APPS}} apps. Since you can [write any code](/code/nodejs/) on Pipedream, and pass API keys or credentials using [environment variables](/environment-variables/), you can connect to virtually any service, so the list is not exhaustive.

But Pipedream-integrated apps provide a few benefits:

- You can [connect the app once](/connected-accounts/) and [link that connected account to any step of a workflow](/connected-accounts/#connecting-accounts)
- Pipedream provides [pre-built actions](/components#actions) that wrap common operations for the app. You shouldn't have to write the code to send a message to Slack, or add a new row to a Google Sheet, so actions make that easy. Actions are just code, so you can fork and modify them, or even [publish your own to the Pipedream community](/components/guidelines/#pipedream-registry).
- [You have access to your API keys and access tokens in code steps](/code/nodejs/auth/), so you can write any code to authorize custom requests to these apps.

If we don't have an integration for an app that you'd like to see, please [request it on our Github roadmap](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=app%2C+enhancement&template=app---service-integration.md&title=%5BAPP%5D) or [reach out to our team](https://pipedream.com/support).
  
**Check out the full list of integrated apps [here](https://pipedream.com/apps).**