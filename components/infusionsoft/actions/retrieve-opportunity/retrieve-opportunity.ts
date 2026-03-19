import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Opportunity",
  description:
    "Retrieve a single opportunity by ID. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Opportunity/operation/getOpportunity)",
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
      description: "The ID of the opportunity to retrieve",
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
    const opportunityId = String(this.opportunityId ?? "").trim();
    if (!opportunityId) {
      throw new Error("Opportunity ID is required");
    }
    const fields = this.fields?.split(",").map((f) => f.trim())
      .filter(Boolean)
      .join(",");

    const result = await this.infusionsoft.retrieveOpportunity({
      $,
      opportunityId,
      fields: fields || undefined,
    });

    $.export("$summary", `Successfully retrieved opportunity ${opportunityId}`);

    return result;
  },
});
