import nocrm_io from "../../nocrm_io.app.mjs";

export default {
  name: "Get Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "nocrm_io-get-lead",
  description: "Get a lead. [See docs here](https://www.nocrm.io/api#leads)",
  type: "action",
  props: {
    nocrm_io,
    leadId: {
      propDefinition: [
        nocrm_io,
        "leadId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nocrm_io.getLead({
      $,
      leadId: this.leadId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved lead with id ${response.id}`);
    }

    return response;
  },
};
