import common from "../common/list-props.mjs";
import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";

export default {
  ...common,
  key: "clickup-get-view",
  name: "Get View",
  description: "Get a view. See the docs [here](https://clickup.com/api) in **Views / Get View** section.",
  version: "0.0.8",
  type: "action",
  props: {
    ...common.props,
    listWithFolder: {
      optional: true,
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    listPropsOptional: true,
    tailProps: {
      viewId: propsFragments.viewId,
    },
  }),
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
