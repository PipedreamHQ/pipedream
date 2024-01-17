import zenrows from "../../zenrows.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zenrows-get-scraper-api-usage",
  name: "Get Scraper API Usage",
  description: "Fetches the current API usage statistics for your ZenRows account. [See the documentation](https://docs.zenrows.com/reference/usage)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zenrows,
  },
  async run({ $ }) {
    const response = await this.zenrows.getAPIUsage();
    $.export("$summary", "Retrieved API usage statistics successfully");
    return response;
  },
};
