import app from "../../apify_oauth.app.mjs";
import common from "@pipedream/apify/actions/run-task/run-task.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "apify_oauth-run-task",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    apify: app,
    ...props,
  },
};
