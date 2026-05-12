import getViewIssues from "@pipedream/linear_app/actions/get-view-issues/get-view-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getViewIssues,
  ...utils.getAppProps(getViewIssues),
  key: "linear-get-view-issues",
  description: "Get issues from a custom view in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customView).",
  version: "0.0.1",
};
