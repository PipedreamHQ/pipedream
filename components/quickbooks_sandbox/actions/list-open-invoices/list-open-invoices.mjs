import common from "@pipedream/quickbooks/actions/list-open-invoices/list-open-invoices.mjs";
import app from "../../quickbooks_sandbox.app.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-list-open-invoices",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
