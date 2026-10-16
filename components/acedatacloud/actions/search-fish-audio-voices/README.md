# Search Fish Audio Voices

Search the Fish Audio voice library through a connected AceDataCloud account. By default, the action returns one page of your own voices; turn off **Only My Voices** to search the public library. Use the returned `items[]._id` as **Reference Voice ID** in **Synthesize Fish Audio Speech**. Increase **Page Number** to read another page; the response also includes `total` and `has_more` when provided by the API.

This action makes one read-only request and does not synthesize audio. It awaits Pipedream App registration in [issue #22155](https://github.com/PipedreamHQ/pipedream/issues/22155); local tests do not prove a connected call.
