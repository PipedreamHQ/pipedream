# Get Account

## Overview

Fetches the developer account connected to the API key: the credit balance (`credits`, `song_credits` and `api_credits`), the rate limits and whether a webhook is configured.

Use this action to check the balance before starting generations — every song costs 1 credit — or to monitor credit usage from a scheduled workflow.

# Example Use Cases

1. Alert the team when the credit balance drops below a threshold.
2. Log daily credit usage to a spreadsheet.

# Getting Started

1. Connect the Muziek maken met AI app with an API key from the [developer portal](https://muziekmakenmetai.nl/developers/).
2. Add the **Get Account** action and run it — no further input is needed.

# Troubleshooting

## Authentication errors

An `Unauthorized` error means the API key is invalid or revoked. Create a new key in the [developer portal](https://muziekmakenmetai.nl/developers/).
