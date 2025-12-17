import newProjectUpdateCreated from "@pipedream/linear_app/sources/new-projectupdate-created/new-projectupdate-created.mjs";

import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...newProjectUpdateCreated,
  ...utils.getAppProps(newProjectUpdateCreated),
  key: "linear-new-projectupdate-created",
  description: "Triggers instantly when a project update (status report) is created in Linear. Returns update content, author, project details, and health status. Filters by team and optionally by project. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  version: "0.0.7",
};
