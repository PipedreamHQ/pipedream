# Yutori

## Overview

[Yutori](https://yutori.com) is reimagining how people interact with the web. The [Yutori API](https://yutori.com/api) is an AI web agent platform. Give it a task and it navigates websites, fills forms, extracts data, and completes multi-step workflows using a real cloud browser — or runs deep research across 100+ sources. You can also set up Scouts: recurring monitors that watch any part of the web on a schedule and notify you when something relevant happens.

All components authenticate with a Yutori API key. Get yours at [platform.yutori.com](https://platform.yutori.com). You'll enter it once in Pipedream Connect and it applies to all Yutori actions in your workflows.

## Example Use Cases

- **Competitive monitoring** *(Scout)*: Add the **New Scout Update** trigger, set the query to "alert me when [competitor]'s pricing page changes", and add a Slack step — deploy once and get notified automatically whenever prices change.
- **Job alert** *(Scout)*: Add the **New Scout Update** trigger, set the query to "notify me when new Python engineer roles appear on Stripe's careers page", and add a Send Email step — you'll get an email for every new matching role.
- **Sales research** *(Research)*: Trigger a workflow on a schedule or webhook, add a **Run Research Task** step with a company name as the query, wait for the result, and push the findings summary into Notion or HubSpot before a sales call.
- **Web automation** *(Browsing)*: Trigger a workflow however you like, add a **Run Browsing Task** step with a URL and plain-English instructions (e.g. "fill out this form" or "extract the pricing table"), and pipe the result into a Google Sheet.

## Getting Started

1. Sign up and get an API key at [platform.yutori.com](https://platform.yutori.com)
2. In Pipedream, add a new Yutori connection and enter your API key
3. Add any Yutori action or trigger to your workflow

**Getting browsing and research results (two options):**
- **Webhook (recommended)**: Create a second Pipedream workflow with an HTTP trigger, copy its URL, and paste it into the **Webhook URL** field on Run Browsing Task or Run Research Task. Yutori pushes the result instantly when the task completes.
- **Poll**: Add a Delay step (~15 min) after starting the task, then use **Get Browsing Task Result** or **Get Research Task Result** to fetch the outcome.

**Getting scout findings:** The **New Scout Update** trigger polls automatically (default every 15 minutes) — no extra setup needed.

## Troubleshooting

- **Tasks take 5–15 minutes** — don't poll for results immediately; use the webhook pattern or add a Delay step
- **Webhook not firing** — make sure the webhook URL is publicly accessible (a Pipedream HTTP trigger URL works out of the box)
- **401 Unauthorized** — verify your API key is active at [platform.yutori.com](https://platform.yutori.com)
- **Scout not producing updates** — check that the workflow is still deployed and enabled in Pipedream
- **Need help?** — email [support@yutori.com](mailto:support@yutori.com) or check the [documentation](https://docs.yutori.com)
