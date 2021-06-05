# Security Best Practices

Pipedream implements a range of [privacy and security measures](/privacy-and-security/) meant to protect your data from unauthorized access. Since Pipedream [workflows](/workflows), [event sources](/event-sources), and other resources can run any Node.js code and process any event data, you also have a responsibility to ensure you handle that code and data securely. We've outlined a handful of best practices for that below.

[[toc]]

## Keep your workflow private

By default, all workflow code is private. But [you can make that code public](/public-workflows/) when developing tutorials or examples to share with others. Public workflows can be useful in this context. In all other cases, we recommend you keep your workflow private. 

If you only need to share your workflow with specific people, [you can share your workflow with specific collaborators](#share-your-workflow-only-with-trusted-collaborators).

## Share your workflow only with trusted collaborators

[You can share your workflow with specific individuals](/workflows/managing/#sharing-workflows). **These collaborators have full read / write access to your workflow**. Collaboration is useful when you're working with a contractor or a team, but you should share your workflow only with people you trust.

Audit the list of collaborators on a regular basis. If someone leaves your team, or if you end a contract with a consultant, we recommend you remove them from the list of collaborators.

## Store secrets as Pipedream connected accounts or environment variables

Even if your workflow code is private, you should never store secrets like API keys in code. These secrets should be stored in one of two ways:

- [If Pipedream integrates with the app](https://pipedream.com/apps), use [connected accounts](/connected-accounts/) to link your apps / APIs.
- If you need to store credentials for an app Pipedream doesn't support, or you need to store arbitrary configuration data, use [environment variables](/environment-variables/).

Read more about how Pipedream secures connected accounts / environment variables [here](/privacy-and-security/#third-party-oauth-grants-and-api-keys).

## Deliver data to Pipedream securely

Whenever possible, encrypt data in transit to Pipedream. For example, use HTTPS endpoints when sending HTTP traffic to a workflow.

## Send data out of Pipedream securely

When you connect to APIs in a workflow, or deliver data to third-party destinations, encrypt that data in transit. For example, use HTTPS endpoints when sending HTTP traffic to third parties.

## Add authentication to incoming event data

You can add many public-facing triggers to your workflows. For example, when you add an HTTP trigger to your workflow, anyone with the associated trigger URL can invoke it. You should protect your workflow with an authentication mechanism like [Basic Auth](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication), JWT, or others.

See [this workflow](https://pipedream.com/@dylburger/protect-an-http-endpoint-with-basic-auth-p_pWCYAez/edit) for a Basic Auth example. This reads the username and password encoded in the `Authorization` header and compares it to the expected values, returning a `401 Unauthorized` error if auth fails.

This pattern is typical for protecting workflows: add the authentication logic in a step at the top of your workflow, ending early if auth fails. If auth succeeds, Pipedream runs the remaining steps of your workflow.

## Validate signatures for incoming events, where available

Many apps pass a **signature** with event data delivered via webhooks (or other push delivery systems). The signature is an opaque value computed from the incoming event data and a secret that only you and the app know. When you receive the event, you can validate the signature by computing it yourself and comparing it to the signature sent by the app. If the two values match, it verifies that the app sent the data, and not some third party.

Signatures are specific to the app sending the data, and the app should provide instructions for signature validation. **Not all apps compute signatures, but when they do, you should always verify them**.

When you use a Pipedream [event source](/event-sources/) as your workflow trigger, Pipedream should verify the signature for you. You can always [audit the code behind the event source](#audit-any-code-or-packages-you-use-within-a-workflow) to confirm this, and suggest further security improvements that you find.

See [Stripe's signature docs](https://stripe.com/docs/webhooks/signatures) for a real-world example. Pipedream's Stripe event source [verifies this signature for you](https://github.com/PipedreamHQ/pipedream/blob/bb1ebedf8cbcc6f1f755a8878c759522b8cc145b/components/stripe/sources/custom-webhook-events/custom-webhook-events.js#L49).

## Audit code or packages you use within a workflow

Pipedream workflows are just code. Pipedream provides prebuilt triggers and actions that facilitate common use cases, but these are written and run as code within your workflow. You can examine and modify this code in any way you'd like.

This also means that you can audit the code for any triggers or actions you use in your workflow. We encourage this as a best practice. Even code authored by Pipedream can be improved, and if you notice a vulnerability or other issue, you can submit a patch or raise an issue [in our GitHub repo](https://github.com/PipedreamHQ/pipedream/tree/master/components).

The same follows for [npm](https://www.npmjs.com/) packages. Before you use a new npm package in your workflow, review its page on npm and its repo, if available. Good packages should have recent updates. The package should have a healthy number of downloads and related activity (like GitHub stars), and the package author should be responsive to issues raised by the community. If you don't observe these signals, be wary of using the package in your workflow.

## Limit what you log and return from steps

[Pipedream retains a limited history of event data](/limits/#event-execution-history) and associated logs for event sources and workflows. But if you cannot log specific data in Pipedream for privacy / security reasons, or if you want to limit risk, remember that **Pipedream only stores data returned from or logged in steps**. Specifically, Pipedream will only store:

- The event data emitted from event sources, and any `console` logs / errors
- The event data that triggers your workflow, any `console` logs / errors, [step exports](/workflows/steps/#step-exports), and any data included in error stack traces.

Variables stored in memory that aren't logged or returned from steps are not included in Pipedream logs. Since you can modify any code in your Pipedream workflow, if you want to limit what gets logged from a Pipedream action or other step, you can adjust the code accordingly, removing any logs or step exports.
