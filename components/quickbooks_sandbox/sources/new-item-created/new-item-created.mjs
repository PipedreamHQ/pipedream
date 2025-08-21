import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/sources/new-item-created/new-item-created.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-new-item-created",
  version: "0.0.4",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
