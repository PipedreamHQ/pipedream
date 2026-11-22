# Generate Veo Video

Submit one asynchronous Veo request using the connected AceDataCloud account. A successful response contains `task_id` and `state: submitted`; it does not contain a finished media result. Save the task ID and use AceDataCloud task history or an approved callback to inspect it. Task lookup is not published in this PR. The action does not automatically retry a paid request.

Use a token with Veo service access or a global token. Check current service pricing before running a paid request. For a timeout, 408, 5xx, or missing task ID, inspect the account's task or usage history before submitting again; a second request may be charged. Never expose the connected API key in prompts or output.

This source action is not yet evidence of a published Pipedream component or a real connected run. App registration is tracked in [issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155).

## Image and ingredient models

Use **Generation Mode** with the matching model. **Image to Video** accepts 1–2 **Reference Images** (first frame, optionally last frame). **Reference Ingredients** accepts 1–3 images and requires `veo31-fast-ingredients`; the action rejects a mismatched model instead of allowing the API to substitute one. Text generation retains the existing defaults. Model choices refresh from the published video API contract.
