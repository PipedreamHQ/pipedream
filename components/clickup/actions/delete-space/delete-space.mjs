import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-delete-space",
  name: "Delete Space",
  description: "Delete a space. See the docs [here](https://clickup.com/api) in **Spaces  / Delete Space** section.",
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
    },
  },
  async run({ $ }) {
    const { spaceId } = this;

    const response = await this.clickup.deleteSpace({
      $,
      spaceId,
    });

    $.export("$summary", "Successfully deleted space");

    return response;
  },
};
