import common from "../common/space-props.mjs";

export default {
  key: "clickup-get-space",
  name: "Get Space",
  description: "Get a space in a workplace. See the docs [here](https://clickup.com/api) in **Spaces / Get Space** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
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
