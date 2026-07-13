# Overview

The Getty Images API gives you programmatic access to one of the world's largest collections of licensed photography, illustrations, and editorial content. Use it on Pipedream to search for images by keyword, filter by license type or orientation, download licensed assets, and organize images into collections — all connected with cloud storage, CMS platforms, marketing tools, or any other app in your stack.

# Example Use Cases

- **Content Pipeline Automation**: Search Getty Images for photos matching a campaign keyword, then automatically upload the results to a Google Drive folder and post a summary with preview thumbnails to a Slack channel for team review.

- **Scheduled Asset Monitoring**: Poll Getty Images on a schedule for new search results matching specific criteria (e.g. `"product launch 2025"`). When new images appear, log them to a Google Sheet and notify a Notion database for content tracking.

- **Licensed Image Download on Demand**: Trigger a workflow from an Airtable record update that includes an image ID. Use the Download Image action to retrieve the licensed asset URI and store the file in Amazon S3 for use in downstream publishing workflows.

- **Collection Management**: Create a named Getty Images collection from a workflow step and share the collection ID with a CMS or DAM system (e.g. Contentful or Bynder) to keep curated image sets in sync across tools.
