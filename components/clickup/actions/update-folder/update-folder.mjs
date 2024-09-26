import common from "../common/folder-props.mjs";

export default {
  ...common,
  key: "clickup-update-folder",
  name: "Update Folder",
  description: "Update a folder. See the docs [here](https://clickup.com/api) in **Folders / Update Folder** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      type: "string",
      description: "The name of folder",
    },
    hidden: {
      label: "Hidden",
      type: "boolean",
      description: "Folder will be set hidden",
      default: false,
    },
  },
  async run({ $ }) {
    const {
      folderId,
      name,
      hidden,
    } = this;

    const response = await this.clickup.updateFolder({
      $,
      folderId,
      data: {
        name,
        hidden,
      },
    });

    $.export("$summary", "Successfully updated folder");

    return response;
  },
};
