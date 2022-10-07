import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-folder-views",
  name: "Get Folder Views",
  description: "Get all views of a folder. See the docs [here](https://clickup.com/api) in **Views  / Get Folder Views** section.",
  version: "0.0.3",
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

    const response = await this.clickup.getFolderViews({
      $,
      folderId,
    });

    $.export("$summary", "Successfully retrieved folder views");

    return response;
  },
};
