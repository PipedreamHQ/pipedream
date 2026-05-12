import app from "../../databricks_oauth.app.mjs";
import common from "@pipedream/databricks/actions/set-sql-warehouse-config/set-sql-warehouse-config.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-set-sql-warehouse-config",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
