import common from "../common.mjs";

const { linearApp } = common.props;

export default {
  ...common,
  key: "linear_app-search-issues",
  name: "Search issues",
  description: "Search issues. See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {},
};
