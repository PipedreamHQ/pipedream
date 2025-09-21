import app from "../../notion_api_key.app.mjs";
import common from "@pipedream/notion/actions/retrieve-database-schema/retrieve-database-schema.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "notion_api_key-retrieve-database-schema",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    notion: app,
    ...props,
  },
};
