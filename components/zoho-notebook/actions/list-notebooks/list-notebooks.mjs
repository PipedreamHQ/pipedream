import noteManagementApp from "../../note_management_app.app.mjs";

export default {
  key: "zoho-notebook-list-notebooks",
  name: "List Notebooks",
  description: "Retrieve a list of all notebooks created by the user. You can optionally filter out notebooks that do not have the given tag.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    noteManagementApp,
    tag: {
      ...noteManagementApp.propDefinitions.tag,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.noteManagementApp.getNotebooks({
      tag: this.tag,
    });
    $.export("$summary", `Successfully listed ${response.length} notebooks`);
    return response;
  },
};
