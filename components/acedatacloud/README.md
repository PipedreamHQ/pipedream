# Overview

AceDataCloud provides Seedream image generation and editing through an asynchronous API. These actions submit an image job once, return its task ID, and retrieve the result in a separate step.

## Actions

- **Generate Image**: Create an image from a prompt.
- **Edit Image**: Edit one publicly accessible image URL using a prompt.
- **Get Image Task**: Read a submitted task and its full result. It does not start a new image job.

The first two actions return `state: submitted` with a `task_id`. This is an acknowledgment, not a completed image. Use **Get Image Task** with that ID until `state` is `completed` or `failed`. A `completed` response retains the full `response.data` array, usage, per-image errors, and any available cost field. Image URLs should be saved promptly because their lifetime is not guaranteed.

**Get Image Task publication gate:** Task lookup must be limited to the authenticated task owner on the AceDataCloud server before this action is published for customer use. The proposed fix in [PlatformService PR #2530](https://github.com/AceDataCloud/PlatformService/pull/2530) was closed without merge. A connected API key is not proof of ownership of an arbitrary task ID. The action's availability in this repository or a workflow editor does not establish that the server-side gate has passed.

# Example Use Cases

1. Generate a product image after a form submission, then retrieve and archive the result.
2. Edit an uploaded image, then send its completed URL to a content workflow.
3. Resume checking a task after a workflow execution ends, using its saved task ID.

# Getting Started

1. Create an account at [AceDataCloud](https://platform.acedata.cloud).
2. Get Seedream access and create an API token in [Applications](https://platform.acedata.cloud/console/applications).
3. Once the `acedatacloud` app is registered and visible in Pipedream, connect it and paste the token into the secret **API Key** field. Requests use `Authorization: Bearer <api_key>`. Pipedream app registration is tracked in [issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155); this repository PR alone does not make the app installable.
4. Choose **Generate Image** or **Edit Image**. Start with Seedream 5.0 Lite, size `2K`, and one output image. Run the submission step once and save the returned `task_id` in a durable workflow record before any delay or later execution.
5. After task lookup has passed the server-side publication gate, wait briefly, then run **Get Image Task** with that exact `task_id` and the same connected account. If `state` is `pending`, delay and run only the lookup again. If the workflow ends first, preserve the ID and resume lookup in a later run. Never repeat the generation step as a polling mechanism.
6. When `state` is `completed`, inspect `response.success`, every item in `response.data`, and any item-level `error` before consuming image URLs. When `state` is `failed`, inspect `response.error` and `trace_id`. For `not_found` or `unknown`, keep the ID and investigate the account and raw task record; do not automatically submit a replacement.

These initial actions require only Seedream access. A service token is sufficient for that service; other AceDataCloud services may require their own token or a global token. See the [image API](https://platform.acedata.cloud/documents/seedream-images) and [task API](https://platform.acedata.cloud/documents/seedream-tasks).

## Workflow and release states

The three actions are source components in this pull request. They become selectable only after Pipedream registers the app credentials and publishes the components. A successful repository check, merge, or visible app listing does not prove that a connected account can generate an image. Before calling the integration operational, verify a real account connection, one asynchronous submission, terminal task lookup, readable image output, and the corresponding AceDataCloud usage record. Keep the task ID so a timeout can be investigated without paying for a second submission.

The source code pins the public Lite and Pro model IDs. If the public model catalog changes, update the dropdown and model-specific size validation together, increment the component version, and retest both a submission and terminal lookup before publication. A new model or fallback must also be checked against its actual price and capabilities; the actions do not silently switch models.

# Troubleshooting

- **Submitted but no image yet:** Query the same task ID later. Do not run Generate Image or Edit Image again just to check progress.
- **Submission timed out, returned HTTP 408/5xx, or lost its response:** The job may already exist. Inspect task history or usage records before submitting again; a second submission may be billed separately. There is no verified client idempotency key for these actions.
- **HTTP 400 or 403 on submission:** Read the original API error for parameter, access, or moderation details. Correct the cause before making a new request. **HTTP 429:** Apply backoff to read-only task lookup; do not automatically replay a generation request whose outcome is unclear.
- **Authentication failed:** Check the API key and its Seedream access. Keys are not written to workflow outputs or summaries by these actions.
- **Task failed:** Inspect `response.error` and `trace_id` in the returned task. A completed task can also contain item-level image errors.
- **Cost:** Image generation is billed according to the selected model and successfully produced output. A task ID alone is not a billing record. The final `response.cost` field is best-effort and may be absent; check the AceDataCloud usage record for the actual charge. Task retrieval does not submit or bill another generation.
