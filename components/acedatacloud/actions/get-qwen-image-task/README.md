# Get Qwen Image Task

Read a previously submitted task by the exact `task_id` returned from the matching Qwen Image submission. This action does not start another generation request. It preserves the task record and adds a derived `state` of `pending`, `completed`, `failed`, `not_found`, or `unknown`.

**Customer publication gate:** Before making task lookup available to customer accounts, confirm the AceDataCloud server restricts task reads to the authenticated owner and verify controlled cross-account rejection for pending, completed, and failed tasks. The Seedream-specific [PlatformService PR #2530](https://github.com/AceDataCloud/PlatformService/pull/2530) closed without merge; it does not establish a fix for this service. The connected API key alone does not establish ownership of an arbitrary task ID.

The Pipedream App registration request is [issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155). This source action has not yet had a real Pipedream connection and terminal task readback.
