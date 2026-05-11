import app from "../../databricks_oauth.app.mjs";
import common from "@pipedream/databricks/actions/edit-sql-warehouse/edit-sql-warehouse.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "databricks_oauth-edit-sql-warehouse",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    databricks: app,
    ...props,
  },
};
