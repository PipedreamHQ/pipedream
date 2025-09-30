import { ConfigurationError } from "@pipedream/platform";
import prospeo from "../../prospeo.app.mjs";

export default {
  name: "Find Mobile Number",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "prospeo-find-mobile-number",
  description: "Discover mobile numbers associated with a LinkedIn profile URL. [See the documentation](https://prospeo.io/api/mobile-finder)",
  type: "action",
  props: {
    prospeo,
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn profile URL.This endpoint is only compatible with public LinkedIn URL, and will not work with special IDs starting in `ACw..`, or `ACo...`",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.prospeo.findMobile({
        $,
        data: {
          url: this.linkedinUrl,
        },
      });

      $.export("$summary", `Successfully found mobile number for **${this.linkedinUrl}**`);

      return response;
    } catch ({ response }) {
      if (response.data.message === "NO_RESULT") {
        $.export("$summary", `No results found for **${this.linkedinUrl}**`);
        return {};
      } else {
        throw new ConfigurationError(response.data.message);
      }
    }
  },
};
