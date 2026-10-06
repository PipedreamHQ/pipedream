# Overview

Retrieve the full record for an existing Seedream task. This read-only action does not submit a new image job. It adds `state` to the API record: `not_found`, `pending`, `completed`, `failed`, or `unknown`.

This action requires server-side task ownership checks before customer publication. The earlier [PlatformService PR #2530](https://github.com/AceDataCloud/PlatformService/pull/2530) was closed without merge; an API key alone does not establish ownership of any task ID passed to this action.

# Getting Started

Pass the `task_id` from **Generate Image** or **Edit Image** using the same connected account. A completed task contains the final envelope in `response`, including `data` items. Preserve the full result because individual images may contain errors and cost may be absent when a best-effort price lookup times out. Running this lookup more than once does not resubmit image generation.

# Troubleshooting

For `pending`, run this action again with the same ID later. For `failed`, inspect `response.error` and `trace_id`. `not_found` can also mean the task is not visible to the connected account.
