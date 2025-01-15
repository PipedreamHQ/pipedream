import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/actions/get-column-values/get-column-values.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-get-column-values",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
