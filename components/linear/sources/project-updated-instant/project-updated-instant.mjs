import projectUpdatedInstant from "@pipedream/linear_app/sources/project-updated-instant/project-updated-instant.mjs";

import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...projectUpdatedInstant,
  ...utils.getAppProps(projectUpdatedInstant),
  key: "linear-project-updated-instant",
  description: "Triggers instantly when a project is updated in Linear. Returns project details including name, description, status, dates, and team info. Supports filtering by specific teams. Uses OAuth authentication. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  version: "0.0.6",
};
