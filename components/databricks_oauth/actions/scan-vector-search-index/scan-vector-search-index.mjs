import app from "../../databricks_oauth.app.mjs";
import common from "@pipedream/databricks/actions/scan-vector-search-index/scan-vector-search-index.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-scan-vector-search-index",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
