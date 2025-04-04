import searchIssues from "@pipedream/linear_app/actions/search-issues/search-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...searchIssues,
  ...utils.getAppProps(searchIssues),
  key: "linear-search-issues",
  description: "Search issues (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  version: "0.2.9",
};

