import app from "../../monday_oauth.app.mjs";
import common from "@pipedream/monday/actions/create-board/create-board.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "monday_oauth-create-board",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
