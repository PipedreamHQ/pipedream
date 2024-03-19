import noteManagementApp from "../../note_management_app.app.mjs";

export default {
  key: "zoho-notebook-create-notebook",
  name: "Create Notebook",
  description: "Creates a new notebook. [See the documentation](https://www.zoho.com/notebook/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    noteManagementApp,
    notebookName: noteManagementApp.propDefinitions.notebookName,
    color: noteManagementApp.propDefinitions.color,
    description: noteManagementApp.propDefinitions.description,
  },
  async run({ $ }) {
    const response = await this.noteManagementApp.createNotebook({
      notebookName: this.notebookName,
      color: this.color,
      description: this.description,
    });
    $.export("$summary", `Successfully created notebook ${this.notebookName}`);
    return response;
  },
};
