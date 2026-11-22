# Generate Kling Video

Submit one asynchronous Kling request using the connected AceDataCloud account. A successful response contains `task_id` and `state: submitted`; it does not contain a finished media result. Save the task ID and use AceDataCloud task history or an approved callback to inspect it. Task lookup is not published in this PR. The action does not automatically retry a paid request.

Use a token with Kling service access or a global token. Check current service pricing before running a paid request. For a timeout, 408, 5xx, or missing task ID, inspect the account's task or usage history before submitting again; a second request may be charged. Never expose the connected API key in prompts or output.

This source action is not yet evidence of a published Pipedream component or a real connected run. App registration is tracked in [issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155).

## Frame and Omni references

Choose **Image / Reference to Video** to use **First Frame URL** and an optional **Last Frame URL**. A last frame requires a first frame; the documented legacy models require Pro mode or do not support a last frame. **Quality Mode** defaults to the existing `std` setting.

For `kling-o1` and `kling-v3-omni`, **Omni Reference Images** and **Omni Reference Video** create the native reference lists. Mention each asset in Prompt using `<<<image_N>>>` or `<<<video_1>>>`. Up to 7 images are accepted, reduced to 4 with a video. A `base` video cannot be combined with frame URLs. Generated audio must be off with a reference video, and reference-video pricing applies. The selected model is never replaced automatically.
