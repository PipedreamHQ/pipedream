import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/actions/update-column-values/update-column-values.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-update-column-values",
  version: "0.1.0",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
