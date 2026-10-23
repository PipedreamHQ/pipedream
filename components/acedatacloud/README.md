# Overview

**Suno music, Seedance and HappyHorse video, GPT Image and Nano Banana images, plus GPT chat — through Ace Data Cloud.** Connect one Ace API key, choose an individual action and configure native fields. No custom HTTP URL, Authorization header or request JSON is needed for these actions.

This contribution contains **26 actions**: the original 24 media/search actions plus **List Chat Models** and **Chat With GPT Model**. Search by the service name rather than guessing a generic API action. Ace Data Cloud supplies this integration and API credential; it is not the first-party Suno, OpenAI, or Google app.

**Release status:** [official App registration](https://github.com/PipedreamHQ/pipedream/issues/22155) and [component review](https://github.com/PipedreamHQ/pipedream/pull/22156) are pending. The intended [official AceDataCloud app page](https://pipedream.com/apps/acedatacloud) is not yet a working installation route. Do not interpret this README or a passing test as official publication.

## Find the service you want

| Search terms | Individual action | Result |
|---|---|---|
| Suno, music | Generate Suno Music | One `task_id`, `state: submitted` |
| Seedance, video | Generate Seedance Video | One `task_id`, `state: submitted` |
| HappyHorse, Happy Horse, video | Generate HappyHorse Video | One `task_id`, `state: submitted` |
| GPT Image, image editing | Generate GPT Image / Edit GPT Image | One `task_id`, `state: submitted` |
| Nano Banana, image editing | Generate Nano Banana Image / Edit Nano Banana Image | One `task_id`, `state: submitted` |
| GPT, chat, models | Chat With GPT Model / List Chat Models | Completion with usage / read-only model list |

Other actions cover Seedream, Qwen Image, Veo, Google Search, Grok Video, Face Transform, Midjourney, Flux, MiniMax Video, Wan, Kling, Fish Audio speech and voice search. Each action is selected separately under the AceDataCloud connection. Separate per-service App identities have not been approved; no first-party provider identity is claimed.

## Supported Pipedream surfaces

[Official registry components](https://pipedream.com/docs/components/contributing) can be distributed through **Connect and MCP** after acceptance and publication. These are the long-term target. Pipedream [announced](https://pipedream.com/docs/workflows) that **Workflows and String shut down on March 31, 2027** and no longer accept new signups/subscriptions; Connect, MCP Servers and API Proxy are unaffected. Existing Workflows users can use accepted actions until that service retires; do not sign up for Workflows based on this guide.

# Example Use Cases

- Select **Generate Suno Music** to submit a music brief, save its task ID, and inspect your own Ace task history for the completed audio.
- Select **Generate Seedance Video** or **Generate HappyHorse Video** without building an HTTP body.
- Choose GPT Image or Nano Banana generation/editing as a dedicated action, using a public image URL for editing.
- Select **List Chat Models** to inspect GPT chat choices without generating text, then choose a model in **Chat With GPT Model**. Options use the intersection of the authenticated Models API and published GPT chat catalog; listing a model does not grant service access.

# Getting Started

## 1. Use the correct official integration

After App registration and publication, use the [AceDataCloud official app page](https://pipedream.com/apps/acedatacloud), confirm the app slug is `acedatacloud`, and select the service-specific action above. For Connect, use the published component key (for example `acedatacloud-suno-generate-music`) with the official [configure/run component flow](https://pipedream.com/docs/connect/components/actions). Configure the connected account through your existing approved Pipedream project; never include the API key in an action payload, URL or prompt.

For an existing Workflows account, choose **Add step → Search apps/actions → AceDataCloud → the exact service action**. The following is an **official historical Pipedream screenshot with Google Sheets**, downloaded 2026-10-18; original capture date/version are unstated. It shows where app/action selection occurs, not an Ace installation or connection. No Ace token dialog has been captured, so this guide does not fabricate one.

![Official Pipedream action selector; Google Sheets reference, not Ace](https://mintcdn.com/pipedream/Acz4Z1ch6TM7-aI8/images/bd45e785-image.png)

Source: [Pipedream Workflow Development](https://pipedream.com/docs/workflows/quickstart). The original screenshot is also preserved under `common/tutorial/`; its Workflows UI is historical reference, not a Connect UI guarantee.

## 2. Register or sign in to Ace and get the right Token

[Register/sign in to Ace Data Cloud](https://platform.acedata.cloud/?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_signup), then open [Applications](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_api_key). If there is no **General application**, choose **Initialize General Application** first.

1. Open **General application**. Its API key can access services your account is entitled to use. A service-specific key is limited to that service. Check the selected service's permissions, current balance and [price](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_pricing) before any metered run.
2. Copy the selected API key using the copy icon. To keep a separate Pipedream credential, choose **Manage Keys → Create**.

![Ace Applications: copy a key or open Manage Keys](https://raw.githubusercontent.com/AceDataCloud/pipedream/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/get-api-key-en.png)

3. Name it, for example `Pipedream Connect`. Set expiration and usage/API restrictions as needed; create the Token and copy it from the list. If Allowed APIs is enabled, include the operation selected below. Query operations may be needed in your own Ace task history, but no task-lookup action is published in this contribution.

![Ace Applications: create an optional dedicated API Token](https://raw.githubusercontent.com/AceDataCloud/pipedream/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/create-api-key-en.png)

These two credential screenshots are **real Ace Applications UI**, reused from the [SunoDify tutorial at pinned commit 8d3d035](https://github.com/AceDataCloud/SunoDify/tree/8d3d03570e73324220f111f7fe343da0792a8071/_assets/tutorial); downloaded 2026-10-18. Credentials are redacted. The creation screenshot retains the example name `Dify tutorial`; use your own name such as `Pipedream Connect`. They show Ace key acquisition, not Pipedream execution.

Copy only the Token string: no `Bearer ` prefix, quotes or redacted placeholder characters. A platform management token such as `platform-...` is not the generation API key.

## 3. Paste it into the connected account secret

When the registered App's connection form is available, paste the Token into the **`api_key` secret field** requested in [App issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155). Its final displayed label is pending Pipedream registration. Save the connected account and select that account in the action's **AceDataCloud** app prop. The component sends the Bearer header for you.

The proposed connection check is a random unknown-ID `POST /seedream/tasks` retrieve, not a paid generation. API-side valid/invalid key behavior was checked on 2026-10-12; Pipedream's support/configuration for this POST connection check remains unverified. Do not use a Generate action just to validate a key.

## 4. Configure a first service action

| Action | Native fields for a minimal example | API permissions |
|---|---|---|
| Generate Suno Music | Model `chirp-v6`; Instrumental `true`; Prompt `A gentle instrumental piano melody, no vocals.` | `/suno/audios` |
| Generate Seedance Video | Model `doubao-seedance-2-0-mini-260615`; Prompt `A calm lake at dawn.` | `/seedance/videos` |
| Generate HappyHorse Video | Model `happyhorse-1.0-t2v`; Prompt `A horse crossing a meadow.` | `/happyhorse/videos` |
| Generate GPT Image | Model `gpt-image-2`; Prompt `A red ceramic mug.` | `/openai/images/generations` |
| Generate Nano Banana Image | Model `nano-banana-2-lite`; Aspect Ratio `1:1`; Resolution `1K`; Prompt `A paper lantern.` | `/nano-banana/images` |
| Chat With GPT Model | Refresh Model options; choose one published GPT chat model; Prompt `Summarize this text in one sentence.`; optional Max Tokens `128` | `/openai/models`, `/openai/chat/completions` |

Examples describe the submitted source defaults, not guaranteed entitlements or a price offer. For image editing, choose the corresponding **Edit** action and supply a public HTTP(S) source image you are authorized to use. No model substitution or fallback is added.

## 5. Read the result without resubmitting

Generation/synthesis returns only `task_id` and `state: submitted`. This means **accepted, still pending**, not finished media. Save that same ID durably. Use your own approved Ace account task history to inspect the original task until terminal. The current contribution intentionally has **no task lookup actions** until each relevant server endpoint enforces authenticated ownership and controlled cross-account tests pass. It also does not expose a callback URL field; do not configure an invented callback control.

A completed task has the generation result under its `response`; check `response.success`, all media entries and per-item errors. Save returned media promptly. A final `cost` field can be absent; verify the matching task/trace usage row rather than treating missing cost as free. Re-running the submission creates another potential paid task. For chat, preserve the full `choices`/`usage` response; it is synchronous and does not create a polling task through this action.

No real connected Pipedream run, terminal media, unique billing record, new registration or paid conversion is claimed by this guide.

[查看中文教程](https://github.com/AceDataCloud/pipedream/blob/codex/acedatacloud-seedream-actions/components/acedatacloud/common/tutorial/README_zh_Hans.md)

# Troubleshooting

| What you see | What to do |
|---|---|
| No AceDataCloud app/action | Registration/publication is pending; a local source file is not an installed public app. |
| Cannot register for Workflows | Workflows is retiring and not accepting new signups. Use the supported Connect/MCP product path when published. |
| Key fails or service is denied | Copy the raw API Token, check scope, expiration, allowed APIs, balance and service access. Never expose it in prompts/logs. |
| Model list empty or stale | Refresh options. Chat uses current authenticated/published GPT catalog intersection and does not silently choose a replacement. |
| `submitted` but no media | Keep the same task ID and inspect your own history. Do not regenerate to poll. |
| Timeout, HTTP 408/5xx or missing task ID | A metered request may have been accepted. Inspect history/usage before manual retry. No automatic retry or fallback is performed. |
| HTTP 400/403/429 | Preserve the API error; correct input/access or wait for rate limits. Do not enable paid retries. |
| Where does the key go? | Pipedream connected-account storage; requests go to `api.acedata.cloud`. Public model catalog GET goes to `platform.acedata.cloud` without the key. |

[Current APIs and pricing](https://platform.acedata.cloud/models?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_pricing) · [Applications / API Token](https://platform.acedata.cloud/console/applications?utm_source=opensource&utm_medium=referral&utm_campaign=evergreen&utm_content=pipedream_readme_api_key) · [Source and review](https://github.com/PipedreamHQ/pipedream/pull/22156)

## Local verification

Run `npm test --prefix components/acedatacloud` after installing dependencies. Synthetic tests live under `common/test/`, excluded by the official publisher. They use no API credits. API-side read-only catalog checks and UI/terminal/billing evidence are reported separately.
