import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/sources/new-employee-created/new-employee-created.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-new-employee-created",
  version: "0.0.5",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
