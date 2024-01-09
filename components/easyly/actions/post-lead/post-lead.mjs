import easyly from "../../easyly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "easyly-post-lead",
  name: "Post New Lead",
  description: "Allows a user to post a new lead to their Easyly account. [See the documentation](https://api.easyly.com/posting)",
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
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.easyly.postNewLead({
      leadDetails: this.leadDetails,
      source: this.source,
    });

    $.export("$summary", `Successfully posted a new lead with ID: ${response.id}`);
    return response;
  },
};
