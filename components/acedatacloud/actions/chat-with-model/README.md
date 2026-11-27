# Overview

Send one text prompt to an Ace Data Cloud model and return its native response and usage. The action uses the Chat Completions, Responses or Messages endpoint declared by the selected model.

# Getting Started

1. Connect your [Ace Data Cloud application API token](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen).
2. Choose a **Model** and enter a **Prompt**. You can also set **System Prompt** and **Max Tokens**. For Messages models, the default output budget is 4,096 tokens.
3. Check the [model price](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen) and run the action. The result contains `choices`, `output` or `content`, depending on the selected protocol.

# Troubleshooting

If the model is missing from the selector, run **List Chat Models** with the same connection. If a completion times out, check your Ace request history before retrying. The first request may have incurred a charge.
