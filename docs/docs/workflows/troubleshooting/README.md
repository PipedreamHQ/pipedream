# Troubleshooting Workflows

## `Pipedream Internal Error`

A `Pipedream Internal Error` is thrown whenever there's an exception during the building or executing of a workflow that's outside the scope of the code for the individual components (steps or actions).

There are a few known ways this can be caused and how to solve them.

## Out of date actions or sources

Pipedream components are updated continously.  But when new versions of actions and sources are published to the Pipedream Component Registry, your workflows are not updated by default.

[An **Update** prompt](/workflows/steps/actions/#updating-actions-to-the-latest-version) is shown in the in the top right of the action if the component has a new version available.

Sources do not feature an update button at this time, to receive the latest version, you'll need to create a new source, then attach it to your workflow.

### New package versions issues

If an NPM or PyPI package throws an error during either the building of the workflow or during it's execution, it may cause a `Pipedream Internal Error`.

By default, Pipedream automatically updates NPM and PyPI packages to the latest version available. This is designed to make sure your workflows receive the latest package updates automatically.

However, if a new package version includes a fatal bug, or changes it's export signature, then this may cause a `Pipedream Internal Error`.

You can potentially fix this issue by downgrading packages by pinning in your Node.js or Python code steps to the last known working version.

Alternatively, if the error is due to a major release that changes the import signature of a package, then modifying your code to match the signature may help.

:::warning Some Pipedream components use NPM packages

Some Pipedream components like pre-built [actions and triggers for Slack use NPM packages](https://github.com/PipedreamHQ/pipedream/blob/9aea8653dc65d438d968971df72e95b17f52d51c/components/slack/slack.app.mjs#L1).

In order to downgrade these packages, you'll need to fork the Pipedream Github Repository and deploy your own changes privately.
:::

### Packages consuming all available storage

A `Pipedream Internal Error` could be the result of NPM or PyPI packages using the entireity of the workflow's storage capacity.

The `lodash` library for example will import the entire package if individual modules are imported with this type of signature:

```javascript
# This style of import will cause the entire lodash package to be installed, not just the pick module
import { pick } from "lodash"
```

Instead, use the specific package that exports the `pick` module alone:

```javascript
# This style imports only the pick module, since the lodash.pick package only contains this module
import pick from "lodash.pick"
```
