import createIssue from "@pipedream/linear_app/actions/create-issue/create-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createIssue,
  ...utils.getAppProps(createIssue),
  key: "linear-create-issue",
  description: "Create an issue (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.4.9",
};

