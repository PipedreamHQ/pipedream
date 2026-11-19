# Overview

**Get Keyword Search Volume** looks up monthly search volume for a list of keywords on Google, Amazon, or both. Each keyword comes back with cost per click, competition, a monthly trend, keyword difficulty and search intent. You can also screen keywords against live US federal trademarks.

The action runs the Apify Actor `vncntlabs/keyword-search-volume` on the connected Apify account and returns one dataset row per keyword.

# Example Use Cases

- Score a list of product keywords before you write listings or ads.
- Compare Google demand with Amazon shopper demand for the same words.
- Flag print-on-demand phrases that match a live US trademark before you print them.

# Getting Started

1. In the Apify Console, open Settings, then Integrations, and create an API token. See [Apify API tokens](https://docs.apify.com/platform/integrations/api).
2. In Pipedream, connect an Apify account and paste that token. The token stays on the account connection. Do not put it in an action field.
3. Add **Get Keyword Search Volume** to a workflow.
4. Enter one or more keywords. Leave data sources empty to use every source available for the country you set.

# Troubleshooting

- **Authentication failed.** Create a new Apify API token and reconnect the account.
- **The run timed out.** This action waits for the Actor to finish, and that wait ends at about 300 seconds. Split a very large keyword list into smaller runs, or use **Run Actor** for a background run.
- **Some keywords are missing.** Words with characters Google rejects (for example `, ! ? % *`), or emoji, are skipped and are not charged. Check the row status and notes.
- **Trademark fields are empty.** Leave trademark screening on, or pass USPTO class numbers such as `025` in trademark classes. Screening is automated and is not legal advice.
- **The charge stopped early.** A maximum charge cap looks up only as many keywords as fit under that cap.
