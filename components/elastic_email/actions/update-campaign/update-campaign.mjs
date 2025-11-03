import app from "../../elastic_email.app.mjs";

export default {
  key: "elastic_email-update-campaign",
  name: "Update Campaign",
  description: "Update a campaign in an Elastic Email account. [See the documentation](https://elasticemail.com/developers/api-documentation/rest-api#operation/campaignsByNamePut)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
  },
  async run() {
  },
};
