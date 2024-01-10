import mailercloud from "../../mailercloud.app.mjs";

export default {
  key: "mailercloud-create-list",
  name: "Create List",
  description: "Creates a new list in the user's Mailercloud account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mailercloud,
    newListName: mailercloud.propDefinitions.newListName,
  },
  async run({ $ }) {
    const response = await this.mailercloud.createNewList(this.newListName);
    $.export("$summary", `Successfully created list: ${this.newListName}`);
    return response;
  },
};
