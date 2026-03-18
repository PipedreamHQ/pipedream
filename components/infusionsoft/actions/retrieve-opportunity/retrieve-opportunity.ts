import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Opportunity",
  description:
    "Retrieve a single opportunity by ID. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Opportunity)",
  key: "infusionsoft-retrieve-opportunity",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to retrieve.",
      optional: false,
    },
    fields: {
      type: "string",
      label: "Fields",
      description:
        "Comma-separated opportunity properties to include (e.g., id,opportunity_title,contact,stage).",
      optional: true,
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.retrieveOpportunity({
      $,
      opportunityId: this.opportunityId,
      fields: this.fields,
    });

    $.export("$summary", `Successfully retrieved opportunity ${this.opportunityId}`);

    return result;
  },
});
