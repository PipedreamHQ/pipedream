import app from "../../quickbooks_sandbox.app.mjs";
import common from "@pipedream/quickbooks/actions/create-payment/create-payment.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-create-payment",
  version: "0.1.4",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
