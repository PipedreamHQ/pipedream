import diffbot from "../../diffbot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diffbot-enhance-organization",
  name: "Enhance Organization",
  description: "Finds and returns detailed information about an organization using its name or URL. [See the documentation](https://www.diffbot.com/dev/docs/organization/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    diffbot,
    organizationNameOrUrl: {
      propDefinition: [
        diffbot,
        "organizationNameOrUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.diffbot.findOrganization({
      organizationNameOrUrl: this.organizationNameOrUrl,
    });
    $.export("$summary", `Detailed information about the organization ${this.organizationNameOrUrl} retrieved successfully`);
    return response;
  },
};
