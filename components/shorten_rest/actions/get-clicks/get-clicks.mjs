import shortenRest from "../../shorten_rest.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shorten_rest-get-clicks",
  name: "Get Click Data for a URL",
  description: "Gets the click data for a specific URL. [See the documentation](https://docs.shorten.rest/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shortenRest,
    url: {
      propDefinition: [
        shortenRest,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shortenRest.getClickData({
      url: this.url,
    });
    $.export("$summary", `Retrieved click data for URL: ${this.url}`);
    return response;
  },
};
