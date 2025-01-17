import newProjectupdateCreated from "@pipedream/linear_app/sources/new-projectupdate-created/new-projectupdate-created.mjs";

import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...newProjectupdateCreated,
  ...utils.getAppProps(newProjectupdateCreated),
  key: "linear-new-projectupdate-created",
  description: "Emit new event when a new Project Update is created. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  version: "0.0.1",
};
