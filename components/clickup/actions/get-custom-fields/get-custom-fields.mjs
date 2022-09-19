import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-custom-fields",
  name: "Get Custom Fields",
  description: "Get a list of custom fields. See the docs [here](https://clickup.com/api) in **Custom Fields  / Get Accessible Custom Fields** section.",
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
      optional: true,
    },
    listId: {
      propDefinition: [
        clickup,
        "lists",
        (c) => ({
          spaceId: c.spaceId,
          folderId: c.folderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const { listId } = this;

    const response = await this.clickup.getCustomFields({
      $,
      listId,
    });

    $.export("$summary", "Successfully retrieved custom fields");

    return response;
  },
};
