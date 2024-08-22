import common from "../common/workspace-prop.mjs";

export default {
  key: "clickup-get-spaces",
  name: "Get Spaces",
  description: "Get a list of spaces in a workplace. See the docs [here](https://clickup.com/api) in **Spaces / Get Spaces** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived spaces",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      workspaceId,
      archived,
    } = this;

    const response = await this.clickup.getSpaces({
      $,
      workspaceId,
      params: {
        archived,
      },
    });

    $.export("$summary", "Successfully retrieved spaces");

    return response;
  },
};
