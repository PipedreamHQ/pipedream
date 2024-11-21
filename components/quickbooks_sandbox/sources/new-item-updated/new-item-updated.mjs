import app from "../../monday_oauth.app.mjs";
import common from "../../../monday/sources/new-item-updated/new-item-updated.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-new-item-updated",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    monday: app,
    ...props,
  },
};
