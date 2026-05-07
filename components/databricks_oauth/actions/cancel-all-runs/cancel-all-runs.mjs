import app from "../../databricks_oauth.app.mjs";
import common from "@pipedream/databricks/actions/cancel-all-runs/cancel-all-runs.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-cancel-all-runs",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
