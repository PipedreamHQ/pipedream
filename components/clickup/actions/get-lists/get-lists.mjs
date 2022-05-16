import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-lists",
  name: "Get Lists",
  description: "Get a list of lists. See the docs [here](https://clickup.com/api) in **Lists  / Get Lists** section.",
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
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived lists",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      folderId,
      archived,
    } = this;

    let response;

    if (!folderId) {
      response = await this.clickup.getFolderlessLists({
        $,
        folderId,
        params: {
          archived,
        },
      });
    } else {
      response = await this.clickup.getLists({
        $,
        folderId,
        params: {
          archived,
        },
      });
    }

    $.export("$summary", "Successfully retrieved lists");

    return response;
  },
};
