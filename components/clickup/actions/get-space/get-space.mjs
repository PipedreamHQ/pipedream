import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-space",
  name: "Get Space",
  description: "Get a space in a workplace. See the docs [here](https://clickup.com/api) in **Spaces  / Get Space** section.",
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
    },
  },
  async run({ $ }) {
    const { spaceId } = this;

    const response = await this.clickup.getSpace({
      $,
      spaceId,
    });

    $.export("$summary", "Successfully retrieved space");

    return response;
  },
};
