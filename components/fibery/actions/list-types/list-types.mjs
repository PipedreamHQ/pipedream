import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-types",
  name: "List Types",
  description: "Lists types in account. [See the docs here](https://api.fibery.io/#get-schema)",
  version: "0.0.1",
  type: "action",
  props: {
    fibery,
    space: {
      propDefinition: [
        fibery,
        "space",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fibery.listTypes({
      space: this.space,
    });
    $.export("$summary", `Successfully listed ${response.length} type(s)`);
    return response;
  },
};
