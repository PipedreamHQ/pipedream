# Overview

Find available meeting time suggestions (and optionally locations) based on the organizer and attendee availability using Microsoft Graph `findMeetingTimes`.

# Example Use Cases

- Suggest available times for a meeting with required attendees
- Find time slots that meet a minimum attendee availability threshold
- Constrain suggestions to a set of conference rooms / resources

# Getting Started

1. Connect your Microsoft Outlook Calendar account.
2. Provide the meeting **Start**, **End**, and **Time Zone** window to search.
3. Optionally add **Attendees** (people) and **Resource Attendees** (rooms/equipment).
4. Optionally set **Meeting Duration**, **Max Candidates**, or **Minimum Attendee Percentage**.

# Troubleshooting

## No Suggestions Returned

If Microsoft Graph can’t find any suggestions, the action returns an `emptySuggestionsReason` value you can use to adjust constraints (for example, widen the time window or reduce the minimum attendee percentage).

## Required Permissions

This endpoint requires delegated calendar permissions. See Microsoft’s documentation for the up-to-date permissions required by `findMeetingTimes`.

