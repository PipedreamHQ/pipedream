import app from "../../webflow.app.mjs";

export default {
  key: "webflow-list-sites",
  name: "List Sites",
  description: "List sites. [See the documentation](https://developers.webflow.com/data/reference/sites/list)",
  version: "2.0.0",
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
