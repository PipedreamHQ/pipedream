import projectUpdatedInstant from "@pipedream/linear_app/sources/project-updated-instant/project-updated-instant.mjs";

import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...projectUpdatedInstant,
  ...utils.getAppProps(projectUpdatedInstant),
  key: "linear-project-updated-instant",
  description: "Emit new event when a project is updated (OAuth). [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.0.3",
};
