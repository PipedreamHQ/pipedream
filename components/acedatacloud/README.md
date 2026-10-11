# Overview

AceDataCloud provides image, video, music, speech, search, and face APIs. This component has 24 actions across the 17 service families formally submitted for Dify: GPT Image, Suno, Seedance, Fish Audio, Seedream, Happy Horse, Qwen Image, Veo, Google Search, Grok Video, Face Transform, Midjourney, Flux, MiniMax Video, Wan, Kling, and Nano Banana.

Generation and synthesis actions send one asynchronous request. A successful response contains `task_id` and `state: submitted`; it does **not** mean finished media exists. Google Search, Face Keypoints, and Fish Audio voice search return synchronous responses. Paid POST requests are never automatically retried by these actions.

## Actions

- Image: Seedream Generate Image, Edit Image, and layer decomposition; GPT Image generate and edit; Nano Banana generate and edit; Flux generate and edit; Qwen Image generate; Midjourney Imagine.
- Video: Veo, Seedance, Kling, Wan, Grok, Happy Horse, MiniMax, and Flux generation.
- Audio: Suno music generation, Fish Audio speech synthesis, and a paginated voice search that supplies reference voice IDs.
- Synchronous: Google Search and Face Keypoints.

This set covers a primary operation for each Dify-submitted service family. Advanced Dify operations such as Suno persona management and Kling commerce modes are outside the current PR.

**Task lookup is withheld from this PR.** Pipedream automatically publishes new action files after merge. AceDataCloud must first deploy server-side task ownership checks and prove that a different account cannot read pending, completed, or failed tasks. The proposed Seedream fix in [PlatformService PR #2530](https://github.com/AceDataCloud/PlatformService/pull/2530) was closed without merge. A connected API key does not establish ownership of an arbitrary task ID. The lookup actions can be submitted separately after this gate is verified for each service.

# Getting Started

1. Create an account at [AceDataCloud](https://platform.acedata.cloud) and get an API token from [Applications](https://platform.acedata.cloud/console/applications). A service token works for its own service; use a global token when a workflow spans service families.
2. After Pipedream registers the `acedatacloud` app and secret `api_key` field, connect the token. [App registration issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155) tracks this step. Source code alone does not make the app selectable.
3. Select the needed action and check its model, input format, service access, and current pricing. A low-cost first run should use a supported model and the smallest suitable output.
4. For an asynchronous action, save the returned `task_id` in a durable workflow record. Inspect it through an approved account task history or callback flow. Do not repeat generation to poll. A missing task ID, timeout, 408, or 5xx response may still mean a paid task was created; inspect task history or usage before trying again.
5. Confirm a terminal result and the corresponding usage or billing record before treating a generation as successful. Media URLs may expire and should be saved promptly.

See the [service catalog](https://platform.acedata.cloud/models) and the API documentation linked from each action description.

## Release state

This PR contributes source actions. Pipedream App registration, upstream review, merge, registry publication, and a connected real run are separate steps. There is no verified Pipedream connection, terminal generation, or billing readback yet. The current checks use synthetic transport and consume no AceDataCloud credits.

## Troubleshooting

- **Submitted but no media:** Preserve `task_id` and inspect approved task history. Do not run the paid submission again as a polling mechanism.
- **Timeout or HTTP 408/5xx:** The request may already have created a task. Check history and usage before retrying.
- **HTTP 400/403:** Read the original API error, correct the input or service access, and then decide whether a new request is appropriate.
- **Authentication failure:** Check that the connected token is an API key with access to this service. Do not put credentials into action props or prompts.
- **Cost:** Pricing varies by service and model. A submitted task ID is not a billing record.
