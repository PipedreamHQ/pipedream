# Overview

BrewPage hosts reviewed HTML and Markdown reports behind temporary HTTPS reader links, without a BrewPage account or API key. The publishing action requires explicit format, visibility and retention choices and returns reader metadata only.

# Getting Started

Use **Publish HTML or Markdown Report** and follow its setup notes. Choose retention from 1 to 30 days. Public reports can appear in the gallery and search; anyone with an Unlisted link can read it. Keep sensitive data out of report content.

# Troubleshooting

The action intentionally discards management capabilities, so it cannot edit, delete or extend a publication. A deduplicated existing report may keep an earlier expiry. Use the returned `expiresAt`, and avoid automatic retries after uncertain publication outcomes.
