import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-delete-folder",
  name: "Delete Folder",
  description: "Delete a folder. See the docs [here](https://clickup.com/api) in **Folders  / Delete Folder** section.",
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
  },
  async run({ $ }) {
    const { folderId } = this;

    const response = await this.clickup.deleteFolder({
      $,
      folderId,
    });

    $.export("$summary", "Successfully deleted folder");

    return response;
  },
};
