import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-create-folder",
  name: "Create Folder",
  description: "Creates a new folder. [See the documentation](https://clickup.com/api) in **Folders / Create Folder** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      spaceId,
      name,
      hidden,
    } = this;

    const response = await this.clickup.createFolder({
      $,
      spaceId,
      data: {
        name,
        hidden,
      },
    });

    $.export("$summary", "Successfully created folder");

    return response;
  },
};
