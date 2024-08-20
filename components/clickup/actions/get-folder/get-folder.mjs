import common from "../common/folder-props.mjs";

export default {
  ...common,
  key: "clickup-get-folder",
  name: "Get Folder",
  description: "Get a folder in a workplace. See the docs [here](https://clickup.com/api) in **Folders / Get Folder** section.",
  version: "0.0.9",
  type: "action",
  async run({ $ }) {
    const { folderId } = this;

    const response = await this.clickup.getFolder({
      $,
      folderId,
    });

    $.export("$summary", "Successfully retrieved folder");

    return response;
  },
};
