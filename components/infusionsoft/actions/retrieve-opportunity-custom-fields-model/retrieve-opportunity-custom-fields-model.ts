import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Opportunity Custom Fields Model",
  description:
    "Retrieve the custom fields model for opportunities. [See the documentation](https://developer.infusionsoft.com/docs/rest/#tag/Opportunity)",
  key: "infusionsoft-retrieve-opportunity-custom-fields-model",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.retrieveOpportunityCustomFieldsModel({
      $,
    });

    $.export("$summary", "Successfully retrieved opportunity custom fields model");

    return result;
  },
});
