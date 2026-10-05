# Overview

AceDataCloud provides Seedream image generation and editing through an asynchronous API. These actions submit an image job once, return its task ID, and retrieve the result in a separate step.

## Actions

- **Generate Image**: Create an image from a prompt.
- **Edit Image**: Edit one publicly accessible image URL using a prompt.
- **Get Image Task**: Read a submitted task and its full result. It does not start a new image job.

The first two actions return `state: submitted` with a `task_id`. This is an acknowledgment, not a completed image. Use **Get Image Task** with that ID until `state` is `completed` or `failed`. A `completed` response retains the full `response.data` array, usage, per-image errors, and any available cost field. Image URLs should be saved promptly because their lifetime is not guaranteed.

# Example Use Cases

1. Generate a product image after a form submission, then retrieve and archive the result.
2. Edit an uploaded image, then send its completed URL to a content workflow.
3. Resume checking a task after a workflow execution ends, using its saved task ID.

# Getting Started

1. Create an account at [AceDataCloud](https://platform.acedata.cloud).
2. Get Seedream access and create an API token in [Applications](https://platform.acedata.cloud/console/applications).
3. Connect AceDataCloud in Pipedream and paste the token into the secret **API Key** field. Requests use `Authorization: Bearer <api_key>`.
4. Submit one image action, save its `task_id`, and call **Get Image Task** in a later step or execution.

These initial actions require only Seedream access. A service token is sufficient for that service; other AceDataCloud services may require their own token or a global token. See the [image API](https://platform.acedata.cloud/documents/seedream-images) and [task API](https://platform.acedata.cloud/documents/seedream-tasks).

# Troubleshooting

- **Submitted but no image yet:** Query the same task ID later. Do not run Generate Image or Edit Image again just to check progress.
- **Submission timed out or returned an error after sending:** The job may already exist. Inspect your task history before submitting again; a second submission may be billed separately.
- **Authentication failed:** Check the API key and its Seedream access. Keys are not written to workflow outputs or summaries by these actions.
- **Task failed:** Inspect `response.error` and `trace_id` in the returned task. A completed task can also contain item-level image errors.
- **Cost:** Image generation is billed according to the selected model and successfully produced output. A task ID alone is not a billing record. Task retrieval does not submit or bill another generation.
