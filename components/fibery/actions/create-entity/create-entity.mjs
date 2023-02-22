import fibery from "../../fibery.app.mjs";

export default {
  key: "fibery-create-entity",
  name: "Create Entity",
  description: "Creates a new entity. [See the docs here]()",
  version: "0.0.1",
  type: "action",
  props: {
    fibery,
  },
  async run({ $ }) {
    const response = await this.fibery.makeCommand({
      command: "",
      args: {},
    });
    $.export("$summary", "Succesfully created a new entity");
    return response;
  },
};
