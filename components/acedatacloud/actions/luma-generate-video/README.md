# Generate Luma Video

This is a Luma action through Ace Data Cloud. After official App registration, connect the `api_key` from your **General application** and ensure it can call this service.

Enter Prompt and optionally supply First Frame URL, Last Frame URL, Aspect Ratio, Loop Video, or Enhance Prompt. The Luma API is Beta and does not expose a model parameter, so this action does not invent a model ID. It uses the declared generate operation.

The action makes one asynchronous request and returns the original `task_id` with `state: submitted`. Save that same task ID and inspect its outcome in your approved Ace task history. Submission is not completed media. This action does not retry, substitute models, or provide an unverified task lookup.

Official Pipedream App registration and component review are still pending. The implementation and schema checks do not claim a connected Pipedream run or successful paid generation.
