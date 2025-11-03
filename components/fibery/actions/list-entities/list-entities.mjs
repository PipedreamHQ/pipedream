import common from "../common/common-entities.mjs";

delete common.props.attributes;

export default {
  ...common,
  key: "fibery-list-entities",
  name: "List Entities",
  description: "Lists entities for a type. [See the docs here](https://api.fibery.io/graphql.html#list-of-entities)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run({ $ }) {
    return this.findEntities($);
  },
};
