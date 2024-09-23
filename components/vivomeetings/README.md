# Overview

The Vivomeetings API allows developers to integrate real-time video conferencing capabilities into their applications. With this API, users can create, manage, and customize video meetings directly through the Pipedream platform. Utilizing Pipedream's serverless execution model, you can interface with the Vivomeetings API to automate meeting setups, dynamically manage participants, and harness data from meeting events for analytics or enhanced user experiences.

# Example Use Cases

- **Automated Meeting Scheduling and Notifications**: Connect Vivomeetings with Google Calendar via Pipedream to automate the creation and scheduling of meetings based on calendar events. This workflow can listen for new events added to a Google Calendar, automatically create a meeting in Vivomeetings, and send custom notifications to participants via email or SMS.

- **Dynamic Meeting Management Based on Attendance**: Integrate Vivomeetings with Slack using Pipedream. This workflow triggers when a scheduled meeting's start time is near, checking if the minimum number of participants have joined. If not, it can send reminders through Slack messages or postpone the meeting automatically, updating all participants via their preferred communication method.

- **Post-Meeting Feedback Collection and Analysis**: After a Vivomeetings session ends, trigger a workflow that sends a feedback form to all participants using Typeform. Collect responses and store them in a Google Sheets spreadsheet for easy analysis and follow-up. This process helps in gathering valuable insights to improve future meetings and participant engagement.
