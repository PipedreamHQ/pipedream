import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/actions/get-sales-receipt/get-sales-receipt.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-get-sales-receipt",
  version: "0.0.3",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
