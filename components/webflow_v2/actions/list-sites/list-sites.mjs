import app from "../../webflow_v2.app.mjs";

export default {
  key: "webflow_v2-list-sites",
  name: "List Sites",
  description: "List sites. [See the docs here](https://developers.webflow.com/#list-sites)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listSites();

    $.export("$summary", "Successfully retrieved sites");

    return response;
  },
};
