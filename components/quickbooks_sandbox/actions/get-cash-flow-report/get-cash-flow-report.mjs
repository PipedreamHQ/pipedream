import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/actions/get-cash-flow-report/get-cash-flow-report.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-get-cash-flow-report",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
