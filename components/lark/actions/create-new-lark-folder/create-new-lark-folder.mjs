import lark from "../../lark.app.mjs";

export default {
  key: "lark-create-new-lark-folder",
  name: "Create New Lark Folder",
  description: "Creates a new, empty Lark folder. [See the documentation](https://open.larksuite.com/document/server-docs/docs/drive-v1/folder/create_folder)",
  version: "0.0.1",
  type: "action",
  props: {
    lark,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new Lark folder",
    },
    folderToken: {
      propDefinition: [
        lark,
        "folderToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lark.createFolder({
      $,
      data: {
        name: this.name,
        folder_token: this.folderToken,
      },
    });
    $.export("$summary", `Successfully created folder with token: ${response.data.token}`);
    return response;
  },
};
