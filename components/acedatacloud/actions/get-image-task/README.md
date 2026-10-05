# Overview

Retrieve the full record for an existing Seedream task. This read-only action does not submit a new image job. It adds `state` to the API record: `not_found`, `pending`, `completed`, `failed`, or `unknown`.

# Getting Started

Pass the `task_id` from **Generate Image** or **Edit Image**. A completed task contains the final envelope in `response`, including `data` items. Preserve the full result because individual images may contain errors and cost may be absent when a best-effort price lookup times out.

# Troubleshooting

For `pending`, run this action again with the same ID later. For `failed`, inspect `response.error` and `trace_id`. `not_found` can also mean the task is not visible to the connected account.
