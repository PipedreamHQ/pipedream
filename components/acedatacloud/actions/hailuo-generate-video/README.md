# Generate Hailuo Video

This is a Hailuo action through Ace Data Cloud. After official App registration, connect the `api_key` from your **General application** and ensure it can call this service.

Select a current Hailuo model and enter Prompt. Image-to-video models require First Frame URL; the text model does not use it. The declared API is Beta and accepts one generate submission. Its legacy public model IDs begin with minimax; the selected ID is preserved.

The action makes one asynchronous request and returns the original `task_id` with `state: submitted`. Save that same task ID and inspect its outcome in your approved Ace task history. Submission is not completed media. This action does not retry, substitute models, or provide an unverified task lookup.

Official Pipedream App registration and component review are still pending. The implementation and schema checks do not claim a connected Pipedream run or successful paid generation.
