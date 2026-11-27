# Overview

Upload a new JavaScript controller version for one of your bots. The upload runs a 400-tick smoke test and, if it passes, the version becomes the bot's active ranked controller.

## Example Use Cases

- **Auto-deploy on push**: when a new controller lands in your repo, upload it so your bot always fights with your latest code.
- **A/B test controllers**: upload a challenger version, watch the rating move, and roll back by re-uploading the previous source.

## Getting Started

Pick the **Bot**, give the version a **Label** (for example `v2`), and paste the full controller **Source**. Start from the arena starter at [api.battle.training/starters/controller.js](https://api.battle.training/starters/controller.js).

## Troubleshooting

- **Smoke test fails**: the version is rejected when the controller does not pass the 400-tick smoke test. Test locally first with the arena SDK (`local-test.mjs`) and aim for over 60% against the `brawler` house bot before uploading.
- **`401 Unauthorized`**: the API key is missing, mistyped, or has been revoked. Reconnect the account in Pipedream.
- **`404` for the bot**: the bot name is wrong, or the bot belongs to a different account. Bot names are unique per account.
