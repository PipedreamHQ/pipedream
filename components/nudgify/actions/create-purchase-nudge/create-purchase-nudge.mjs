import { axios } from "@pipedream/platform";
import app from "../../nudgify.app.mjs";

export default {
  key: "nudgify-create-purchase-nudge",
  name: "Create Purchase Nudge",
  description: "Creates a purchase nudge. [See docs here](https://www.nudgify.com/docs/knowledge-base/api-purchase-nudges/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    siteKey: {
      type: "string",
      label: "Site Key",
      description: "Your site key",
    },
    conversion: {
      type: "object",
      label: "Conversion",
      description: "The conversion details to create the nudge",
    },
  },
  methods: {
    async createPurchaseNudge({
      $, siteKey, conversion,
    }) {
      return axios($, {
        method: "POST",
        url: "https://app.nudgify.com/api/conversions",
        headers: {
          "Authorization": `Bearer ${this.nudgify.$auth.api_key}`,
          "content-type": "application/json",
          "accept": "application/json",
        },
        data: {
          site_key: siteKey,
          conversions: [
            conversion,
          ],
        },
      });
    },
  },
  async run({ $ }) {
    const response = await this.createPurchaseNudge({
      $,
      siteKey: this.siteKey,
      conversion: this.conversion,
    });
    $.export("$summary", "Successfully created purchase nudge");
    return response;
  },
};
