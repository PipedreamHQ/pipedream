import nevtanSign from "../../nevtan_sign.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "nevtan_sign-list-envelopes",
  name: "List Envelopes",
  description: "List the envelopes in a workspace, newest first, optionally filtered by status."
    + " Each envelope includes its `_id`, title, status and participants with their signing status. Use this to find an envelope ID for **Void Envelope** or to check whether an envelope has been completed."
    + " [See the documentation](https://sign.nevtan.com/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nevtanSign,
    workspaceId: {
      propDefinition: [
        nevtanSign,
        "workspaceId",
      ],
    },
    statuses: {
      type: "integer[]",
      label: "Statuses",
      description: "Only return envelopes with one of these statuses: `1` Draft, `2` Sent, `3` In Progress, `4` Completed, `5` Declined / Voided, `6` On Hold. Example: `[2, 4]`. Leave blank to return all envelopes.",
      options: constants.ENVELOPE_STATUS_OPTIONS,
      optional: true,
    },
    maxResults: {
      propDefinition: [
        nevtanSign,
        "maxResults",
      ],
      description: "The maximum number of envelopes to return. Example: `25`. Defaults to `100`.",
    },
  },
  async run({ $ }) {
    let envelopes = await this.nevtanSign.listEnvelopes({
      $,
      workspaceId: this.workspaceId,
    });

    if (this.statuses?.length) {
      const statuses = this.statuses.map(Number);
      envelopes = envelopes.filter(({ status }) => statuses.includes(status));
    }

    if (this.maxResults) {
      envelopes = envelopes.slice(0, this.maxResults);
    }

    $.export("$summary", `Successfully retrieved ${envelopes.length} envelope${envelopes.length === 1
      ? ""
      : "s"}`);
    return envelopes;
  },
};
