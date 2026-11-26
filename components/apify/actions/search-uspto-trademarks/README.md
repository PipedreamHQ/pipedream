# Overview

Search U.S. federal trademarks in the official USPTO database — wordmark, owner, international class, live/dead status, and filing dates — and return the matching records as structured data.

This action runs the [USPTO Trademark Search Actor](https://apify.com/magnova/uspto-trademark-search) on Apify using your connected Apify account. The Actor is pay-per-event: you are charged by Apify per trademark record returned, at the price shown on the Actor's Apify Store page. Use **Max Results** and **Max Total Charge USD** to cap the cost of each run.

Each returned record includes the wordmark, owner of record, status (`LIVE` or `DEAD`), international classes, filing and registration dates, serial and registration numbers, mark type, the goods/services description, and a link to the official TSDR status page for the mark.

# Example Use Cases

- **Brand clearance checks**: search a candidate brand name before adopting it and route any live, conflicting marks to a review step in your workflow.
- **New-filing monitoring**: run on a schedule with **Filed After** set to catch newly filed marks similar to your brand, and post matches to Slack or email.
- **Competitor watch**: track new trademark filings by a competitor's owner name and log them to a spreadsheet or CRM.

# Getting Started

1. Connect your Apify account to Pipedream (an Apify API token from your own account).
2. Set **Wordmark / Brand Text** to the brand text you want to search, or use **Owner Name**, **Serial Number**, or the **Advanced Query** field instead.
3. Adjust **Mark Status**, **International Class**, and the filing-date filters as needed, and set **Max Results** to limit how many records (and how much cost) a run can return.

# Troubleshooting

- **No records returned**: broaden the search — remove the class or date filters, or set **Mark Status** to `Live and dead`. The USPTO database only contains U.S. federal trademark applications and registrations.
- **Run finished with a non-success status**: the error message includes a link to the run in the Apify Console, where the run log shows what happened.
- **Unexpected charges**: the Actor charges per record returned. Lower **Max Results** or set **Max Total Charge USD** to cap each run.
