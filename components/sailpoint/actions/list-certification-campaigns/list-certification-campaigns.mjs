import sailpoint from "../../sailpoint.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sailpoint-list-certification-campaigns",
  name: "List Certification Campaigns",
  description: "Retrieves multiple certification campaigns in IdentityNow. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sailpoint: {
      type: "app",
      app: "identitynow",
    },
    filter: {
      propDefinition: [
        "sailpoint",
        "filter",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const campaigns = await this.sailpoint.retrieveCertificationCampaigns();
    $.export("$summary", `Successfully retrieved ${campaigns.length} certification campaigns`);
    return campaigns;
  },
};
