# Draft a Video Edit

Queue a video edit from a project that already has footage in [ClipReel](https://www.clipreel.com/). Provide the project ID and an edit prompt such as “Shorten the intro and add captions.”

Connect a scoped ClipReel token with Run jobs and Project read. Drafts use your ClipReel plan. If the workflow can retry, give each intended edit a distinct **Idempotency Key** and reuse that key on retries. Pass the job ID to **Read Video Job** and inspect the proposal in ClipReel before applying changes.
