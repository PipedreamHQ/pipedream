import adversus from "../../adversus.app.mjs";

export default {
  key: "adversus-change-lead-status",
  name: "Change Lead Status",
  description: "Change the status of a lead in Adversus. [See the API documentation](https://solutions.adversus.io/api).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    adversus,
    leadId: {
      propDefinition: [
        adversus,
        "leadId",
      ],
    },
    statusId: {
      propDefinition: [
        adversus,
        "statusId",
      ],
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include when changing the status",
      optional: true,
    },
  },
  /**
   * Execute the action to change a lead's status
   * @param {Object} $ - Pipedream context
   * @returns {Promise} The response from changing the lead status
   */
  async run({ $ }) {
    const response = await this.adversus.changeLeadStatus(this.leadId, this.statusId, {
      data: {
        ...(this.additionalFields || {}),
      },
    });

    $.export("$summary", `Successfully changed status of lead ${this.leadId} to status ${this.statusId}`);

    return response;
  },
};

