import getViewIssues from "@pipedream/linear_app/actions/get-view-issues/get-view-issues.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getViewIssues,
  ...utils.getAppProps(getViewIssues),
  key: "linear-get-view-issues",
  description: "Get issues from a custom view in Linear. Use **List Views** first to find the view's id. **Response size matters here:** a view is a saved filter that can cover a large slice of the workspace, and every matching issue is returned at full width — the `description` body plus nested `team`, `project`, `cycle` and `parent` objects. Pass `fields: \"compact\"` (`id,identifier,title,state,assignee,priorityLabel`) unless you specifically need more, and use `first` to cap how many come back. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=customView)",
  version: "0.1.0",
};
