import app from "../../simple_analytics.app.mjs";

export default {
  key: "simple_analytics-list-websites",
  name: "List Websites",
  description: "List the websites in your Simple Analytics account."
    + " Use the `hostname` field with **Get Stats**."
    + " [See the documentation](https://docs.simpleanalytics.com/api/admin)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const { websites } = await this.app.listWebsites({
      $,
    });
    $.export("$summary", `Found ${websites.length} website${websites.length === 1
      ? ""
      : "s"}`);
    return websites;
  },
};
