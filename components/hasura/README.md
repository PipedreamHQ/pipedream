# Overview

The Hasura API offers a powerful way to interact with your Hasura backend using GraphQL to build, query, and mutate your data. On Pipedream, you can leverage this API to create dynamic workflows that react to events in your Hasura instance, automate CRUD operations, and integrate with other services. By using Hasura with Pipedream, you gain the ability to automate tasks, sync data across apps, and respond in real-time to changes in your database.

# Example Use Cases

- **Automate Data Entry**: Sync data from a Google Sheet to your Hasura database. Every time a new row is added in Google Sheets, a Pipedream workflow triggers a GraphQL mutation to insert the data into a specified table in Hasura.

- **Real-time Slack Notifications**: Send a Slack message to a channel whenever a new record is inserted in a Hasura table. This Pipedream workflow listens to Hasura events and uses a Slack step to notify your team in real-time about new entries or changes.

- **Sync Users with Mailchimp**: Automatically add new users from your Hasura user table to a Mailchimp audience. When a new user is created in Hasura, trigger a Pipedream workflow to add that user's email to Mailchimp, helping to keep your marketing efforts in sync with your user base.
