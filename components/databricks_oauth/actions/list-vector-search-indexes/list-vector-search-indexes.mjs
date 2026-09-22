import app from "../../databricks_oauth.app.mjs";
import common from "@pipedream/databricks/actions/list-vector-search-indexes/list-vector-search-indexes.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-list-vector-search-indexes",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
