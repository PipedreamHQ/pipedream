import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-types",
  name: "List Types",
  description: "Lists types in account. [See the docs here](https://api.fibery.io/#get-schema)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fibery,
  },
  async run({ $ }) {
    const response = await this.fibery.listTypes();
    $.export("$summary", `Successfully listed ${response.length} type(s)`);
    return response;
  },
};
