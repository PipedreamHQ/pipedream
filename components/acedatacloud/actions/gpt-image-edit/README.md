# Overview

**GPT Image through Ace Data Cloud.** Select **Edit GPT Image** as an individual Pipedream action; the credential and API are supplied by Ace Data Cloud, not a first-party GPT Image app. [Official AceDataCloud page](https://pipedream.com/apps/acedatacloud) is the intended entry after registration/publication; [review #22156](https://github.com/PipedreamHQ/pipedream/pull/22156) is still pending. Search `GPT Image` to find this action when indexed; search visibility is not yet verified.

# Getting Started

1. Register/sign in to [Ace → Applications](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_gpt_image_edit_api_key). Initialize General application if needed; copy its Token or choose Manage Keys → Create for a dedicated Pipedream Token. Check GPT Image permission, balance and [current price](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_gpt_image_edit_pricing). Copy the raw Token without `Bearer ` or a `platform-...` management token.
2. In the registered Pipedream AceDataCloud connection, paste it into the secret `api_key` field (final displayed label pending). Select that connected account on this action; do not paste a Key in Prompt. Allowed APIs must include `/openai/images/edits`.
3. Set model `gpt-image-2`, Prompt `Make the mug blue`, public Image URL. These are submitted defaults, not an entitlement or price promise. [Full screenshot walkthrough](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/README.md) · [中文教程](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/README_zh_Hans.md).
4. Run once only when the intended paid request is approved. Save `task_id` with `state: submitted`, then inspect that **same** task in your own approved Ace history until its final `response` has success/media. This contribution has no task-query action or callback URL prop; never submit again to poll.

# Troubleshooting

A timeout, HTTP 408/5xx or missing task ID can still mean a paid task exists. Inspect task/request history and matching usage before manual retry. The action never retries or falls back to another model. 400/403/429 retain their meaning; correct input/access or wait. Missing cost does not mean free. No connected Pipedream run, terminal media, unique billing or growth is claimed here.

Official [Connect/MCP registry distribution](https://pipedream.com/docs/components/contributing) remains supported; Workflows is [retiring on 2027-03-31](https://pipedream.com/docs/workflows) and no longer accepts new signups. Use existing Workflows accounts only during the transition, not a new sign-up tutorial.
