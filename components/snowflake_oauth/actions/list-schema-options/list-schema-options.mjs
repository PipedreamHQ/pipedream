import app from "../../snowflake_oauth.app.mjs";
import common from "@pipedream/snowflake/actions/list-schema-options/list-schema-options.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "snowflake_oauth-list-schema-options",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    snowflake: app,
    ...props,
  },
};
