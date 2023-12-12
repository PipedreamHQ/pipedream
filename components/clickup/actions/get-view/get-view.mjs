import common from "../common/view-props.mjs";

export default {
  key: "clickup-get-view",
  name: "Get View",
  description: "Get a view. See the docs [here](https://clickup.com/api) in **Views / Get View** section.",
  version: "0.0.7",
  type: "action",
  props: common.props,
  async run({ $ }) {
    const { viewId } = this;

    const response = await this.clickup.getView({
      $,
      viewId,
    });

    $.export("$summary", "Successfully retrieved view");

    return response;
  },
};
