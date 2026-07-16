# Overview

Use this action to list Monta products whose stock changed after a specified date and time. The response can be used to refresh SKU availability without retrieving the complete product catalog.

# Getting Started

Connect your Monta account and enter **Updated Since** as an ISO 8601 date and time within the previous 7 days. The action returns the products from Monta's `Products` response field.

# Troubleshooting

## Date is too old

Monta rejects dates more than 7 days in the past. Choose a more recent **Updated Since** value and run the action again.

## Rate limit exceeded

Monta applies a separate rate limit to this endpoint: a bucket of 5 requests that replenishes by 1 request every 10 seconds. Wait before retrying if Monta returns HTTP 429.
