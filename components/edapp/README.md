# Overview

EdApp is a mobile-first microlearning platform with an API that enables programmatic interactions with its learning management system. With the EdApp API, you can automate course assignments, track learning progress, manage users, and pull detailed reports. This can significantly enhance learning experiences and administrative efficiency, particularly when integrated with Pipedream's serverless platform. Pipedream allows for the creation of custom workflows that leverage the EdApp API to interact with other services, inducing data-driven actions without manual intervention.

# Example Use Cases

- **Automated Course Enrollment Based on HR System Updates**: Whenever a new employee is added to the HR system, a Pipedream workflow triggers, automatically enrolling the new hire in relevant EdApp courses.

- **Progress Tracking and Reporting**: Set up a Pipedream workflow that periodically fetches course completion data from EdApp and sends a comprehensive report to Slack, keeping the team updated on training progress.

- **Course Completion and Certificate Generation**: Upon detection of a completed course in EdApp, a Pipedream workflow activates that generates a personalized certificate using a service like Canva or Google Slides and emails it to the learner.
