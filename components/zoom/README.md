# Overview

The Zoom API lets you tap into a rich set of functionalities to enhance the video conferencing experience within your own app or workflow. With the Zoom API on Pipedream, you can automatically create meetings, manage users, send meeting notifications, and more, orchestrating these actions within a broader automation. This allows for seamless integration with other services, enabling both data collection and action triggers based on Zoom events.

# Example Use Cases

- **Automated Meeting Scheduling and Notifications**: With Pipedream, you can create a workflow that listens for upcoming calendar events in Google Calendar. Once it detects a new event labeled "Zoom Meeting," it can trigger the Zoom API to create a meeting and then automatically send custom email notifications with the meeting details to all the attendees using SendGrid.

- **Zoom Webinar Attendee Management**: Build a workflow where new sign-ups from an event management platform like Eventbrite trigger the addition of these attendees to a Zoom webinar. Post-webinar, send a follow-up email via Mailgun with a link to the webinar recording, which you can upload to a cloud storage platform like Dropbox.

- **Meeting Analytics and Reporting**: Combine Zoom's meeting ended webhook with Pipedream's capabilities to create a workflow that captures meeting details upon conclusion. With this data, you can send a summary email to the host, update a Google Sheet with attendance information, and even push the data to a BI tool like Tableau for more in-depth analysis.
