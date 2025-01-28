import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/sources/column-value-updated/column-value-updated.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-column-value-updated",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
