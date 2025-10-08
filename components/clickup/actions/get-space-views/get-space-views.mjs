import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-get-space-views",
  name: "Get Space Views",
  description: "Get all views of a space. [See the documentation](https://clickup.com/api) in **Views / Get Space Views** section.",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
