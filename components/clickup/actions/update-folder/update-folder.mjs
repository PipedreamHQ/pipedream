import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-update-folder",
  name: "Update Folder",
  description: "Update a folder. See the docs [here](https://clickup.com/api) in **Folders  / Update Folder** section.",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    spaceId: {
      propDefinition: [
        clickup,
        "spaces",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        clickup,
        "folders",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
    },
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
