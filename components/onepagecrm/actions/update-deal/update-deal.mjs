import onepagecrm from "../../onepagecrm.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "onepagecrm-update-deal",
  name: "Update Deal",
  description: "Updates an existing deal's details in OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    onepagecrm,
    dealId: {
      propDefinition: [
        onepagecrm,
        "dealId",
      ],
    },
    dealData: {
      propDefinition: [
        onepagecrm,
        "dealData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onepagecrm.updateDeal({
      dealId: this.dealId,
      dealData: this.dealData,
    });

    $.export("$summary", `Successfully updated deal with ID ${this.dealId}`);
    return response;
  },
};
