import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-get-space",
  name: "Get Space",
  description: "Get a space in a workplace. See the docs [here](https://clickup.com/api) in **Spaces / Get Space** section.",
  version: "0.0.8",
  type: "action",
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
