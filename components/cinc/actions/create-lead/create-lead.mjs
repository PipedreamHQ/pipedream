import cinc from "../../cinc.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cinc-create-lead",
  name: "Create New Lead in Cinc",
  description: "This component creates a new lead in Cinc. [See the documentation](https://cinc.com/api/docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    cinc,
    leadDetails: {
      propDefinition: [
        cinc,
        "leadDetails",
      ],
    },
    customFields: {
      propDefinition: [
        cinc,
        "customFields",
        (c) => ({
          leadDetails: c.leadDetails,
        }),  // Assuming customFields depends on leadDetails
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.cinc.createLead(this.leadDetails, this.customFields);
    $.export("$summary", `New lead added with ID: ${response.id}`);
    return response;
  },
};
