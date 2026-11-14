import nevtanSign from "../../nevtan_sign.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "nevtan_sign-list-envelopes",
  name: "List Envelopes",
  description: "List the envelopes in a workspace, newest first, optionally filtered by status. Each envelope includes its participants and their signing status.",
  version: "0.0.1",
  type: "action",
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
      description: "Only return envelopes with one of these statuses. Leave blank to return all envelopes.",
      options: constants.ENVELOPE_STATUS_OPTIONS,
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of envelopes to return",
      optional: true,
      default: 100,
      min: 1,
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
