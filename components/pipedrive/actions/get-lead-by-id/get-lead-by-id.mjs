import pipedriveApp from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-get-lead-by-id",
  name: "Get Lead by ID",
  description: "Get a lead by its ID. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Leads#getLead)",
  version: "0.0.3",
  type: "action",
  props: {
    pipedriveApp,
    leadId: {
      propDefinition: [
        pipedriveApp,
        "leadId",
      ],
      description: "The ID of the lead to get",
      optional: false,
    },
  },
  async run({ $ }) {
    const { data } = await this.pipedriveApp.getLead(this.leadId);
    $.export("$summary", `Successfully retrieved lead with ID: ${this.leadId}`);
    return data;
  },
};
