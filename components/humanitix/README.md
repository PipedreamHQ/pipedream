# Humanitix Components for Pipedream

This package contains Pipedream components for integrating with the [Humanitix API](https://humanitix.stoplight.io/docs/humanitix-public-api/e508a657c1467-humanitix-public-api).

## Overview

Humanitix is a ticketing platform that gives booking fees to charity. This integration allows you to interact with events, orders, and tickets through the Humanitix Public API.

## Authentication

To use these components, you'll need a Humanitix API key. You can generate one from your Humanitix account:
1. Go to your Humanitix account settings
2. Navigate to **Advanced** > **Public API Key**
3. Generate and copy your API key

## Components

### Actions

Actions are single operations that can be executed in a Pipedream workflow.

#### Get Events
- **Key**: `humanitix-get-events`
- **Description**: Retrieves a list of events from Humanitix
- **Parameters**:
  - `top` (optional): Number of events to return (max 100, default 50)
  - `skip` (optional): Number of events to skip for pagination (default 0)

#### Get Orders
- **Key**: `humanitix-get-orders`
- **Description**: Retrieves a list of orders from Humanitix
- **Parameters**:
  - `eventId` (optional): Filter orders by event ID
  - `orderId` (optional): Get a specific order by ID
  - `top` (optional): Number of orders to return (max 100, default 50)
  - `skip` (optional): Number of orders to skip for pagination (default 0)

#### Get Tickets
- **Key**: `humanitix-get-tickets`
- **Description**: Retrieves a list of tickets from Humanitix
- **Parameters**:
  - `eventId` (optional): Filter tickets by event ID
  - `orderId` (optional): Filter tickets by order ID
  - `top` (optional): Number of tickets to return (max 100, default 50)
  - `skip` (optional): Number of tickets to skip for pagination (default 0)

### Sources

Sources are event-driven triggers that emit data when changes occur in your Humanitix account.

#### New Event Created
- **Key**: `humanitix-new-event-created`
- **Description**: Emits an event when a new event is created in Humanitix
- **Dedupe**: Unique (only emits new events)
- **Polling Interval**: Configurable (default: 15 minutes)

#### New Order Created
- **Key**: `humanitix-new-order-created`
- **Description**: Emits an event when a new order is created in Humanitix
- **Dedupe**: Unique (only emits new orders)
- **Polling Interval**: Configurable (default: 15 minutes)

#### New Ticket Created
- **Key**: `humanitix-new-ticket-created`
- **Description**: Emits an event when a new ticket is created in Humanitix
- **Dedupe**: Unique (only emits new tickets)
- **Polling Interval**: Configurable (default: 15 minutes)

## API Reference

All components use the Humanitix Public API v1:
- **Base URL**: `https://api.humanitix.com/v1`
- **Authentication**: API key via `x-api-key` header
- **Documentation**: https://humanitix.stoplight.io/docs/humanitix-public-api/e508a657c1467-humanitix-public-api

## Example Workflows

### Monitor New Orders
1. Add the **New Order Created** source to your workflow
2. Connect it to any action (e.g., send to Slack, add to Google Sheets, etc.)
3. Configure the polling interval as needed

### Fetch Event Details
1. Add the **Get Events** action to your workflow
2. Optionally filter by pagination parameters
3. Use the returned data in subsequent steps

## Support

For issues related to:
- **Pipedream components**: Open an issue in the Pipedream repository
- **Humanitix API**: Contact Humanitix support or refer to their [help documentation](https://help.humanitix.com/)

## Version

Current version: 0.1.0
