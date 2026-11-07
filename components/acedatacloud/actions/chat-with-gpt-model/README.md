# Overview

Choose **Chat With GPT Model** under AceDataCloud to send one text prompt through Ace Data Cloud. It exposes a native **Model** selector, Prompt, optional System Prompt and Max Tokens. It does not require a custom HTTP URL and is not a global Pipedream model-provider setting.

# Getting Started

After [official registration/publication](https://github.com/PipedreamHQ/pipedream/issues/22155), connect your raw [Ace API Token](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_api_key) in the `api_key` secret field and select that account. Refresh Model options, choose an eligible GPT chat model, enter a prompt and optionally limit output tokens. Options are the intersection of the connected `/openai/models` response and published GPT chat catalog. Current catalog visibility does not grant permission or promise availability; check [service price and balance](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_pricing).

The action sends one synchronous `/openai/chat/completions` request with `stream: false` and returns the full completion, including `choices`, finish reasons and `usage`. It does not poll a media task, retry a paid request, choose a fallback or hide 4xx API errors. A timeout/408/5xx or missing choices requires checking original request/usage history before manual retry.

[Token screenshots and exact connection steps](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/README.md) · [中文教程](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/README_zh_Hans.md). No real connected completion or billing evidence is claimed; tests use synthetic transport. Connect/MCP is the supported distribution target; existing Workflows is retiring in 2027.
