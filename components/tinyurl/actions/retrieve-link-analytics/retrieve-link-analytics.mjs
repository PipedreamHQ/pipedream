import tinyurl from "../../tinyurl.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tinyurl-retrieve-link-analytics",
  name: "Retrieve Link Analytics",
  description: "Retrieves analytics for a specific TinyURL link, including total clicks, geographic breakdowns, and device types. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tinyurl,
    analyticsLinkIdOrAlias: {
      propDefinition: [
        tinyurl,
        "analyticsLinkIdOrAlias",
      ],
    },
  },
  async run({ $ }) {
    const analytics = await this.tinyurl.retrieveAnalytics();
    $.export("$summary", `Retrieved analytics for link ${this.analyticsLinkIdOrAlias}`);
    return analytics;
  },
};
