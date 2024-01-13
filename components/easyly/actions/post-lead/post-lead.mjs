import easyly from "../../easyly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "easyly-post-lead",
  name: "Post New Lead",
  description: "Allows a user to post a new lead to their Easyly account. [See the Easyly API documentation](https://api.easyly.com/posting)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    easyly,
    leadDetails: {
      propDefinition: [
        easyly,
        "leadDetails",
      ],
    },
    source: {
      propDefinition: [
        easyly,
        "source",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const leadData = {
      fullname: this.leadDetails.name,
      email: this.leadDetails.email,
      phone: this.leadDetails.contactNumber,
      ...(this.source && {
        source: this.source,
      }),
    };

    const response = await this.easyly.postNewLead({
      leadDetails: leadData,
      source: this.source,
    });

    $.export("$summary", `Successfully posted new lead with details: ${JSON.stringify(leadData)}`);
    return response;
  },
};
