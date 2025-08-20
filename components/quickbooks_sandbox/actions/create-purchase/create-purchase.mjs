import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/actions/create-purchase/create-purchase.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-create-purchase",
  version: "0.1.5",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
