# TextLocal New Contact Source

## Introduction

This source emits a new event each time a new contact is added to your a
specific **Contact Group** . For that purpose, it makes usage of the [**Get
Contacts**](https://api.txtlocal.com/docs/contactmanagement/getcontacts) API,
that returns all the contacts in a Contact Group.

## Prerequisites

The only pre-requisite to use this event source is for users to provide a valid
[API key](https://api.txtlocal.com/docs/).

To set up the TextLocal API Key, go to the [Pipedream
Accounts](https://pipedream.com/accounts) page, and click on the **CONNECT AN
APP** button. Look for the **TextLocal** app, and click on it. Under the
`api_key` field, enter the API key corresponding to your TextLocal account
(available in your [account's
settings](https://control.txtlocal.co.uk/settings/apikeys/)). Give this API key
a nickname (optional), and click on **SAVE**.

## Usage

1. Visit the [Pipedream Sources](https://pipedream.com/sources) page and
   click **Create Source**.
2. Select the **TextLocal** app and choose the **New Contact**
   source.
3. You'll be prompted to enter the time interval for the executions. The default
   value is 15 minutes.
4. From the dropdown list labeled as **Contact Group**, select the specific
   group that you want this event source to monitor.

## Technical Details

Due to the fact that the [**Get
Contacts**](https://api.txtlocal.com/docs/contactmanagement/getcontacts) API
does not offer sorting or filtering capabilities beyond a specific Contact Group
(via the `group_id` parameter), the approach taken by this event source is to
periodically scan the entire Contact Group selected by the user, and for each
entry it will check if any of the phone numbers has been already processed or
not. In case a number hasn't been processed before, the event source will emit a
new event, and will mark the number as processed.

This implies that whenever this event source is activated for the first time, it
needs to take an initial **snapshot** of the whole Contact Group so that the
numbers in the group are effectively marked as **processed** and not event is
emitted for those contacts.

Ideally, such a snapshot initialization would be taken during the execution of
the `activate()` hook. However, since a taking a snapshot of a Contact Group can
be a lengthy operation, it can potentially cause a timeout during the activation
of the event source, which would prevent the event source from getting created.

To solve this, taking the initial snapshot is delegated to the first execution
of the event source. This guarantees the activation and creation of the event
source, with the downside of dedicating the first execution entirely to the
snapshot initialization. This means that no event will be emitted during the
first execution of the event source, because in order for the event source to
detect a new contact (and emit an event for that) it needs to compare the
current state of the contact group against a previous state, but at that point
the previous state is unknown.
