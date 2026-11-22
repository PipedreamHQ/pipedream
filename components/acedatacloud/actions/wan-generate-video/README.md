# Generate Wan Video

Submit one asynchronous Wan request using the connected AceDataCloud account. A successful response contains `task_id` and `state: submitted`; it does not contain a finished media result. Save the task ID and use AceDataCloud task history or an approved callback to inspect it. Task lookup is not published in this PR. The action does not automatically retry a paid request.

Use a token with Wan service access or a global token. Check current service pricing before running a paid request. For a timeout, 408, 5xx, or missing task ID, inspect the account's task or usage history before submitting again; a second request may be charged. Never expose the connected API key in prompts or output.

This source action is not yet evidence of a published Pipedream component or a real connected run. App registration is tracked in [issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155).

## Image and reference models

Use **Image to Video** with a matching `wan2.6-i2v` model and **First Frame URL**. Use **Reference to Video** with `wan2.6-r2v` and **Reference Videos**. Missing inputs or incompatible model modes are rejected before submission.

`wan3.0-video` supports first/last frames or reference images, videos, and audio through the corresponding native fields. Frame inputs and reference mode are separate choices. Wan 3 accepts at most 10 media items. Reference-video input seconds contribute to usage in addition to output; inspect the current service pricing before running. Existing text-generation defaults remain unchanged.
