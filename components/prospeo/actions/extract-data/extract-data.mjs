import { ConfigurationError } from "@pipedream/platform";
import prospeo from "../../prospeo.app.mjs";

export default {
  name: "Extract Data",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prospeo-extract-data",
  description: "Extract data from any LinkedIn profile in real-time, as well as all the data from the company page, and also find a valid verified email from the lead. [See the documentation](https://prospeo.io/api/social-url-enrichment)",
  type: "action",
  props: {
    prospeo,
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn profile URL.This endpoint is only compatible with public LinkedIn URL, and will not work with special IDs starting in `ACw..`, or `ACo...`",
    },
    profileOnly: {
      type: "boolean",
      label: "Profile Only",
      description: "If true, only the profile data will be returned. If false, the company data will also be returned.",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.prospeo.extractData({
        $,
        data: {
          url: this.linkedinUrl,
          profile_only: this.profileOnly,
        },
      });

      $.export("$summary", `Successfully extracted data for **${this.linkedinUrl}**`);

      return response;
    } catch ({ response }) {
      if (response.data.message === "NO_RESULT") {
        $.export("$summary", `No data found for **${this.linkedinUrl}**`);
        return {};
      } else {
        throw new ConfigurationError(response.data.message);
      }
    }
  },
};
