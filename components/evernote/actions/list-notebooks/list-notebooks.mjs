import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-list-notebooks",
  name: "List Notebooks",
  description: "List all notebooks in Evernote. [See the documentation](https://dev.evernote.com/doc/reference/NoteStore.html#Fn_NoteStore_listNotebooks).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    evernote,
  },
  async run({ $ }) {
    const response = await this.evernote.listNotebooks();
    $.export("$summary", "Successfully retrieved notebooks");
    return response;
  },
};
