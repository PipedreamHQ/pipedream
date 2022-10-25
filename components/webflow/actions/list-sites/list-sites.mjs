import webflow from "../../webflow.app.mjs";

export default {
  key: "webflow-list-sites",
  name: "List Sites",
  description: "List sites. [See the docs here](https://developers.webflow.com/#list-sites)",
  version: "0.0.2",
  type: "action",
  props: {
    webflow,
  },
  async run({ $ }) {
    const response = await this.webflow.getSites();

    $.export("$summary", "Successfully retrieved sites");

    return response;
  },
};
