//import projectUpdatedInstant from
//"@pipedream/linear_app/sources/project-updated-instant/project-updated-instant.mjs";
import projectUpdatedInstant from "../../../linear_app/sources/project-updated-instant/project-updated-instant.mjs";

// TODO: Will update above statement to import from @pipedream/linear_app
// after updates to linear_app are published

import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...projectUpdatedInstant,
  ...utils.getAppProps(projectUpdatedInstant),
  key: "linear-project-updated-instant",
  description: "Emit new event when a project is updated (OAuth). [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.0.1",
};
