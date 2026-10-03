# Overview

Search detailed time entries across a Toggl Track workspace. The action uses the connected user's Toggl Track account, so Toggl determines which entries are visible based on that user's workspace, project, and organization permissions.

The action supports date ranges, users, projects, clients, tasks, tags, descriptions, and billable status. It can enrich results with related user and project information and returns a cursor when more entries are available.

# Example Use Cases

- Review time recorded by accessible team members during a reporting period.
- Retrieve entries for selected projects, clients, users, or tags.
- Supply detailed time-entry data to an AI assistant or another workflow step.
- Continue a large report across multiple workflow runs using the returned cursor.

# Getting Started

1. Connect the Toggl Track account whose permissions should control the report results.
2. Select a workspace. Use **List Workspace ID Options** if you need to find an accessible workspace ID.
3. Enter inclusive start and end dates in `YYYY-MM-DD` format. The end date must be after the start date.
4. Add any optional filters and choose the maximum number of entries to return.
5. Run the action. When `hasMore` is `true`, pass the values from `nextCursor` to **First ID** and **First Row Number** in a subsequent run.

See Toggl's [Detailed reports documentation](https://engineering.toggl.com/docs/track/reports/detailed_reports/) for API behavior and supported report fields.

# Troubleshooting

## No entries are returned

Confirm that the selected workspace and date range contain time entries visible to the connected account. A successful response with zero entries can be expected when Toggl permissions or filters exclude all matching records.

## More results are available

If `hasMore` is `true`, use the returned `nextCursor` values in another run. Keep the same workspace, date range, filters, and ordering to continue the same report consistently.

## Results differ between connected accounts

This is expected. The action does not elevate access: Toggl applies the roles and permissions of each connected account to every Reports API request.
