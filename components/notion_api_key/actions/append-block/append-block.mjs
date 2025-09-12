import app from "../../notion_api_key.app.mjs";
import common from "@pipedream/notion/actions/append-block/append-block.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "notion_api_key-append-block",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    notion: app,
    ...props,
  },
};
