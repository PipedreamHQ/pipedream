import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/sources/subitem-column-value-updated/subitem-column-value-updated.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-subitem-column-value-updated",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
