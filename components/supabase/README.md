# Overview

Supabase is a real-time backend-as-a-service that provides developers with a suite of tools to quickly build and scale their applications. It offers database storage, authentication, instant APIs, and real-time subscriptions. With the Supabase API, you can perform CRUD operations on your database, manage users, and listen to database changes in real time. When integrated with Pipedream, you can automate workflows that react to these database events, synchronize data across multiple services, or streamline user management processes.

# Example Use Cases

- **Sync Supabase Data to Google Sheets**: Automatically update a Google Sheet with new data from a Supabase database. Whenever a new row is added to a specified Supabase table, a Pipedream workflow is triggered, appending the data to a Google Sheet. This can be useful for non-technical stakeholders needing real-time visibility into the database without direct access.

- **User Signup Email Confirmation**: Send a welcome email to new users who sign up via your Supabase-powered app. Utilize Pipedream to listen for new signups in Supabase, and then trigger an email through an email service provider like SendGrid. This helps in engaging users from the moment they create an account.

- **Aggregate Logs and Monitor Events**: Collect logs from your Supabase application and send them to a logging platform like Datadog. Monitor events in your Supabase database, such as updates or deletes, and forward these events from Pipedream to Datadog for real-time monitoring and analysis. This workflow is key for maintaining oversight and security within your application.
