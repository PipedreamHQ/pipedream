import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-list-entity",
  name: "List Entity",
  description: "Lists custom entities in account. [See the docs here](https://api.fibery.io/#get-schema)",
  version: "0.0.1",
  type: "action",
  props: {
    fibery,
  },
  async run({ $ }) {
    const response = await this.fibery.listEntities();
    const suffix = response.length === 1
      ? "y"
      : "ies";
    $.export("$summary", `Successfully listed ${response.length} entit${suffix}`);
    return response;
  },
};
