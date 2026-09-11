import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/actions/list-updates/list-updates.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-list-updates",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
