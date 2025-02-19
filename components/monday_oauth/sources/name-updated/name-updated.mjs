import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/sources/name-updated/name-updated.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-name-updated",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
