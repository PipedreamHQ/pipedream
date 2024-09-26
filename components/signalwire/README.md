# Overview

The SignalWire API provides powerful communication capabilities, allowing developers to send and receive text messages, make voice calls, and manage telephony features programmatically. On Pipedream, you can leverage these functionalities to create serverless workflows that integrate with numerous apps and services. With Pipedream's easy-to-use interface and robust connectivity options, you can build automated processes that trigger from various events and perform actions using SignalWire without managing infrastructure.

# Example Use Cases

- **SMS Notifications for New eCommerce Orders**: When a new order comes in on an eCommerce platform like Shopify, use SignalWire to send an SMS notification to the customer confirming their order and providing a tracking number. A Pipedream workflow can listen for new orders and then trigger the SignalWire API to send the message.

- **Voice Alert System for Website Downtime**: Combine SignalWire with a monitoring service like UptimeRobot. When your website goes down, UptimeRobot triggers a Pipedream workflow that uses SignalWire to place a voice call to the website administrator, alerting them immediately to the issue for a faster response.

- **Two-Factor Authentication for User Logins**: When a user attempts to login to your custom application, trigger a Pipedream workflow that sends a unique code via SMS through SignalWire. This workflow ensures an additional layer of security by verifying the user's identity with a code sent to their mobile device.
