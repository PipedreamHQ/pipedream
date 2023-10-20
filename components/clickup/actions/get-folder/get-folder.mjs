import common from "../common/folder-props.mjs";

export default {
  key: "clickup-get-folder",
  name: "Get Folder",
  description: "Get a folder in a workplace. See the docs [here](https://clickup.com/api) in **Folders / Get Folder** section.",
  version: "0.0.6",
  type: "action",
  props: common.props,
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
