import common from "../common/space-props.mjs";

export default {
  ...common,
  key: "clickup-get-folders",
  name: "Get Folders",
  description: "Get a list of folders in a workplace. See the docs [here](https://clickup.com/api) in **Folders / Get Folders** section.",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Filter for archived folders",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spaceId,
      archived,
    } = this;

    const response = await this.clickup.getFolders({
      $,
      spaceId,
      params: {
        archived,
      },
    });

    $.export("$summary", "Successfully retrieved folders");

    return response;
  },
};
