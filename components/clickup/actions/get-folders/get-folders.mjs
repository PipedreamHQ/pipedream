import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-folders",
  name: "Get Folders",
  description: "Get a list of folders in a workplace. See the docs [here](https://clickup.com/api) in **Folders  / Get Folders** section.",
  version: "0.0.1",
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
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived folders",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spaceId,
      archived,
    } = this;

    const response = await this.clickup.getFolders({
      $,
      spaceId,
      params: {
        archived,
      },
    });

    $.export("$summary", "Successfully retrieved folders");

    return response;
  },
};
