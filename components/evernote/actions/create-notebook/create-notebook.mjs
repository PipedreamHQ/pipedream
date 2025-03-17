import evernote from "../../evernote.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "evernote-create-notebook",
  name: "Create Notebook",
  description: "Creates a new notebook in Evernote. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    evernote,
    notebookName: {
      propDefinition: [
        "evernote",
        "notebookName",
      ],
    },
    notebookAdditionalFields: {
      propDefinition: [
        "evernote",
        "notebookAdditionalFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const notebook = await this.evernote.createNotebook();
    $.export("$summary", `Created notebook ${notebook.name}`);
    return notebook;
  },
};
