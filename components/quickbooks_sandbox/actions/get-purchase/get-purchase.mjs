import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/actions/get-purchase/get-purchase.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-get-purchase",
  version: "0.0.4",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
