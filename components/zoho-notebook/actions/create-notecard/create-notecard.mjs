import noteManagementApp from "../../note_management_app.app.mjs";

export default {
  key: "zoho-notebook-create-notecard",
  name: "Create Notecard",
  description: "Creates a new notecard within a specified notebook. [See the documentation](https://www.zoho.com/notebook/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    noteManagementApp,
    notebookId: {
      propDefinition: [
        noteManagementApp,
        "notebookId",
      ],
    },
    notecardName: {
      propDefinition: [
        noteManagementApp,
        "notecardName",
      ],
    },
    content: {
      propDefinition: [
        noteManagementApp,
        "content",
        (c) => ({
          notebookId: c.notebookId,
        }), // optional prop, passing value from previously configured prop
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        noteManagementApp,
        "tags",
        (c) => ({
          notebookId: c.notebookId,
        }), // optional prop, passing value from previously configured prop
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.noteManagementApp.createNotecard({
      notebookId: this.notebookId,
      notecardName: this.notecardName,
      content: this.content,
      tags: this.tags,
    });
    $.export("$summary", `Successfully created notecard ${this.notecardName}`);
    return response;
  },
};
