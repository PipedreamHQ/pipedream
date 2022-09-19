import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-folder",
  name: "Get Folder",
  description: "Get a folder in a workplace. See the docs [here](https://clickup.com/api) in **Folders  / Get Folder** section.",
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

    const response = await this.clickup.getFolder({
      $,
      folderId,
    });

    $.export("$summary", "Successfully retrieved folder");

    return response;
  },
};
