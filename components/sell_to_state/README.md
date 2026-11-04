# Overview

[Sell to State](https://selltostate.com) holds government tenders and contract awards from official procurement sources in more than 60 countries, in one schema. Every tender links to the official notice.

# Example Use Cases

- **New tenders to Slack**: start a workflow when Sell to State adds an open UK tender about "payroll software", and post it to a channel.
- **Account research**: get the profile of a public buyer (spend by year, top suppliers) and add it to a CRM record before a sales call.
- **Competitor tracking**: find the companies that win contracts about a subject in a country, and save them to a sheet.

# Getting Started

Create a Sell to State account with an active plan, then create an API key at [app.selltostate.com/account/keys](https://app.selltostate.com/account/keys). Paste the key when you connect the app.

# Troubleshooting

- `402 payment_required`: the account has no active plan.
- `400 unknown_country`: use a country slug such as `united-kingdom` or `new-zealand`.
