import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-get-space-views",
  name: "Get Space Views",
  description: "Get all views of a space. See the docs [here](https://clickup.com/api) in **Views / Get Space Views** section.",
  version: "0.0.8",
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
