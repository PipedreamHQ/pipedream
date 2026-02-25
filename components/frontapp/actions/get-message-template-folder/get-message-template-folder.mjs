import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-message-template-folder",
  name: "Get Message Template Folder",
  description: "Fetch a message template folder. [See the documentation](https://dev.frontapp.com/reference/get-folder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    frontapp,
    folderId: {
      propDefinition: [
        frontapp,
        "folderId",
      ],
    },
  },
  async run({ $ }) {
    const folder = await this.frontapp.getMessageTemplateFolder({
      $,
      folderId: this.folderId,
    });

    $.export("$summary", `Successfully retrieved message template folder with ID: ${this.folderId}`);

    return folder;
  },
};
