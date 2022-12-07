import getIssue from "../../../linear_app/actions/get-issue/get-issue.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...getIssue,
  ...utils.getAppProps(getIssue),
  key: "linear-get-issue",
  description: "Get an issue by ID (OAuth). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  version: "0.0.4",
};

