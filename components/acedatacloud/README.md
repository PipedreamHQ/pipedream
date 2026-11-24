# Ace Data Cloud

Connect an [Ace Data Cloud application API token](https://platform.acedata.cloud/console/applications) that is permitted to use the selected models. [Pipedream app registration](https://github.com/PipedreamHQ/pipedream/issues/22155) is pending.

- **List Chat Models** returns chat IDs that appear in both the account model list and the published typed catalog. It does not generate text.
- **Chat With Model** sends a text prompt through the selected model's published Chat Completions, Responses, or Messages endpoint. Check the [model catalog and pricing](https://platform.acedata.cloud/models) before running this action.

Run `npm test` from this directory to test model discovery and request/response behavior with fixtures.
