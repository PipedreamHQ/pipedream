import app from "../../apify_oauth.app.mjs";
import common from "@pipedream/apify/sources/new-finished-task-run-instant/new-finished-task-run-instant.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "apify_oauth-new-finished-task-run-instant",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    apify: app,
    ...props,
  },
};
