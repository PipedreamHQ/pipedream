# Overview

[Privatus Analytics](https://privatusanalytics.com) is cookieless web analytics. With the Privatus Analytics API on Pipedream you can read stats, manage goals, chart notes, campaign links and costs, uptime checks, alerts, status pages, exports, members, site audits, A/B and split URL experiments and testimonials, and start a workflow the moment something happens in your workspace.

The components use only the public [Privatus Analytics API](https://privatusanalytics.com/docs/api) and its signed [webhooks](https://privatusanalytics.com/docs/api/webhooks). Nothing here deletes data.

## Example use cases

- Send a weekly traffic report to Slack or email: run **Get Site Stats** on a schedule with a comparison to the previous period.
- Post to a channel when an uptime check goes down: use the **New Uptime Check Down (Instant)** source, then **Pause Uptime Check** or **Post Status Page Update** from the same workflow.
- Thank happy customers: start from **New Testimonial (Instant)** with a minimum rating of 5 stars, then **Approve Testimonial** and send an email.
- Mark every deploy on your charts: call **Create Chart Note** from your CI workflow.

# Getting Started

1. In Privatus Analytics, open **Workspace settings**, then **API tokens**, and create a token. It starts with `pat_`.
2. For every action and source to work, keep all permissions, choose **Every site you can access** and set the expiry to **never**. The sources add a webhook, which needs the workspace settings permission and every site.
3. In Pipedream, connect the Privatus Analytics account and paste the token as the **API Token**.

A token belongs to exactly one workspace, so there is no workspace to choose. Connect a second account for a second workspace.

## Sources

There is one instant source for each of the 25 webhook events: alert triggered or resolved, goal alert triggered, usage threshold reached, uptime check down or recovered, new site, site deleted, new member, export ready, analytics import completed or failed, site audit completed, experiment ended, new testimonial, testimonial approved, rejected, restored, moved to trash or deleted, testimonial form submitted, testimonial request sent or finished, testimonial import finished and new reviews found by sync.

Deploying a source creates a webhook in your workspace. Deactivating or deleting the source deletes it. The signing secret of the webhook is kept in the database of the source, and every delivery must carry a valid `Privatus-Signature` header at most five minutes old, or it is answered with `401` and nothing is emitted.

Most sources have an optional **Site** filter. Alert sources can also filter by alert rule, form sources by form, request sources by request, and testimonial sources by minimum rating.

An emitted event is the data of the event plus `id` (the delivery ID), `event`, `occurred_at` and `workspace_id`. An `id` inside the data is kept as `record_id` (`export_id` for exports).

## Actions

Create Site, Create Goal, Create Chart Note, Create Workspace Chart Note, Create Campaign Link, Add Campaign Cost, Create Uptime Check, Pause Uptime Check, Resume Uptime Check, Acknowledge Alert, Mute Alert, Post Status Page Update, Create Export, Invite Members, Run Site Audit, Start Experiment, Pause Experiment, End Experiment, Create Testimonial, Update Testimonial, Approve Testimonial, Reject Testimonial, Return Testimonial to Pending, Pin Testimonial, Create Testimonial Person, Ask for Testimonial and Send Custom API Request.

Searches (they return a list): Find Site, Find Goals, Find Uptime Checks, Find Alert Rules, Find Members, Find Experiments, Find Testimonials, Find Testimonial People, Get Site Stats, Get Top Values, Get Time Series, Get Live Visitors, Get Latest Site Audit and Get Testimonial.

# Troubleshooting

- **401 or "The API token was refused":** the token is wrong, was revoked or has expired. Create a new token and reconnect the account.
- **402:** the feature needs a higher Privatus Analytics plan. The message names it.
- **A source cannot be deployed:** the token needs the workspace settings permission and every site.
- **A source emits nothing:** check the **Site** filter and the other filters of the source, and the delivery log under **Workspace settings**, then **Webhooks**, in Privatus Analytics.
- **Dates:** day fields take `YYYY-MM-DD`. The month of a campaign cost takes `YYYY-MM`.
- **Filters:** stats actions take filters as JSON, for example `[["country","is","US"],["page","starts_with","/blog"]]`. See the [filters documentation](https://privatusanalytics.com/docs/api/filters).
