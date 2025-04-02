import newProjectUpdateCreated from "@pipedream/linear_app/sources/new-projectupdate-created/new-projectupdate-created.mjs";

import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...newProjectUpdateCreated,
  ...utils.getAppProps(newProjectUpdateCreated),
  key: "linear-new-projectupdate-created",
  description: "Project updates are short status reports on the health of your projects. Emit new event when a new Project Update is written. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.0.2",
};
