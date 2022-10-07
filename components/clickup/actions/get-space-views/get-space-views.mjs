import clickup from "../../clickup.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "clickup-get-space-views",
  name: "Get Space Views",
  description: "Get all views of a space. See the docs [here](https://clickup.com/api) in **Views  / Get Space Views** section.",
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

    const response = await this.clickup.getSpaceViews({
      $,
      spaceId,
    });

    $.export("$summary", "Successfully retrieved space views");

    return response;
  },
};
