# ClipReel for Pipedream

Use [ClipReel](https://www.clipreel.com/) to queue a prompt-led video draft and retrieve the job result from a Pipedream workflow.

Create a scoped token at [Connect an agent](https://www.clipreel.com/agents/connect) with Project read and Run jobs. Connect it as the ClipReel API token. Import source footage into a private ClipReel project before passing its ID to **Draft a Video Edit**.

Pass the returned job ID into **Read Video Job** after a delay. Inspect the proposal’s review link in ClipReel. Drafting uses the connected account’s editing allowance. Job outputs can include private, short-lived URLs, so keep the workflow and its run history private.

If an automated workflow can retry the draft action, give each intended edit a stable **Idempotency Key** and reuse it on retries.

[ClipReel API guide](https://www.clipreel.com/agents/automate-video-editing-with-ai-agents)
