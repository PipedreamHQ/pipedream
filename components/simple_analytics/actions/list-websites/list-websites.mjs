import app from "../../simple_analytics.app.mjs";

export default {
  key: "simple_analytics-list-websites",
  name: "List Websites",
  description: "Lists the websites tracked in the connected Simple Analytics account."
    + " Use it when the user asks which sites they track, or to find the exact hostname that **Get Stats** needs."
    + " Not for traffic numbers: use **Get Stats** for pageviews, visitors and breakdowns."
    + " Takes no inputs and returns every site in the account; it cannot add or edit sites."
    + " Returns `websites`, each with hostname, is_public, timezone, has_ssl, has_script, own_hostname, label, and estimated monthly pageviews and events."
    + " Example: no inputs → websites such as `example.com` (timezone `Europe/Amsterdam`, 12400 pageviews)."
    + " [See the documentation](https://docs.simpleanalytics.com/api/admin)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listWebsites({
      $,
    });
    const count = response?.websites?.length ?? 0;
    $.export("$summary", `Found ${count} website${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
