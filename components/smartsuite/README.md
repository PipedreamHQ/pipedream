# Overview

The SmartSuite API offers a way to streamline work by automating tasks, managing data, and integrating with other services. Within Pipedream, you can leverage this API to create workflows that react to events in SmartSuite, manipulate data within SmartSuite, or synchronize data between SmartSuite and other apps. This could range from updating project statuses, to aggregating data for reports, to syncing contacts across platforms.

# Example Use Cases

- **Project Management Automation**: Automatically update a project's status in SmartSuite when a related GitHub issue is closed. This workflow would use the GitHub app to trigger an event in Pipedream when an issue is closed, then use the SmartSuite API to update the project status accordingly.

- **Customer Feedback Collection**: Collect customer feedback from a Typeform survey and create a new item in a SmartSuite feedback tracker. Upon form submission, the workflow would be triggered, capturing the feedback and using the SmartSuite API to create a record, ensuring customer insights are centrally stored and actionable.

- **Daily Sales Report Generation**: Generate a daily sales report by aggregating data from a SmartSuite sales tracker and emailing it through SendGrid. Set up a scheduled trigger in Pipedream to fetch the latest sales data from SmartSuite each day and compile it into a report, which is then sent out as an email using SendGrid's API.
