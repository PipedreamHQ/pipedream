import common from "@pipedream/quickbooks/actions/list-past-due-invoices/list-past-due-invoices.mjs";
import app from "../../quickbooks_sandbox.app.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "quickbooks_sandbox-list-past-due-invoices",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    quickbooks: app,
    ...props,
  },
};
