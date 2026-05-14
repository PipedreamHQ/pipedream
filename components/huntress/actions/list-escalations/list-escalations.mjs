import app from "../../huntress.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "huntress-list-escalations",
  name: "List Escalations",
  description: "List escalations associated with your Huntress account. Escalations notify account administrators that a situation requires their attention. [See the documentation](https://api.huntress.io/docs#tag/escalations/get/v1/escalations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    status: {
      type: "string",
      label: "Status",
      description: "Filter by status.",
      optional: true,
      options: constants.ESCALATION_STATUS_OPTIONS,
    },
  },
  async run({ $ }) {
    const escalations = await this.app.paginate({
      fn: this.app.listEscalations.bind(this.app),
      fnArgs: {
        $,
        params: {
          status: this.status,
        },
      },
      keyField: "escalations",
    });

    $.export("$summary", `Successfully retrieved \`${escalations.length}\` escalation(s)`);

    return escalations;
  },
};
