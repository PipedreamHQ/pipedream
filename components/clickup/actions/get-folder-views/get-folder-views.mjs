import common from "../common/folder-props.mjs";

export default {
  ...common,
  key: "clickup-get-folder-views",
  name: "Get Folder Views",
  description: "Get all views of a folder. See the docs [here](https://clickup.com/api) in **Views / Get Folder Views** section.",
  version: "0.0.8",
  type: "action",
  async run({ $ }) {
    const { folderId } = this;

    const response = await this.clickup.getFolderViews({
      $,
      folderId,
    });

    $.export("$summary", "Successfully retrieved folder views");

    return response;
  },
};
